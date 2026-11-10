import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {

    // Default port. Change to 8082 if 8081 is already in use.
    private static final int PORT = 8081;

    public static void main(String[] args) {
        try {
            Path publicDir = resolvePublicFolder();
            System.out.println("Serving static files from: " + publicDir.toAbsolutePath());

            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
            server.createContext("/", exchange -> handleRequest(exchange, publicDir));
            server.setExecutor(null);
            server.start();

            System.out.println("==================================================");
            System.out.println("   🎬 MOVIE REVIEW AND RATING SYSTEM (MovieVerse)");
            System.out.println("==================================================");
            System.out.println("Server running successfully at:");
            System.out.println("👉 http://localhost:" + PORT);
            System.out.println("Press Ctrl+C to stop the server.");
            System.out.println("==================================================");

        } catch (IOException e) {
            System.err.println("Unable to start the server: " + e.getMessage());
            if (e instanceof java.net.BindException) {
                System.err.println("Port " + PORT + " is already in use.");
                System.err.println("Try changing PORT in Main.java to 8082 and restart.");
            }
        }
    }

    /**
     * Resolves the public directory flexibly whether run from project root,
     * MovieReviewSystem folder, or an IDE.
     */
    private static Path resolvePublicFolder() {
        Path[] candidates = new Path[] {
            Paths.get("public"),
            Paths.get("MovieReviewSystem", "public"),
            Paths.get("..", "public"),
            Paths.get(System.getProperty("user.dir"), "public"),
            Paths.get(System.getProperty("user.dir"), "MovieReviewSystem", "public")
        };

        for (Path candidate : candidates) {
            if (Files.exists(candidate) && Files.isDirectory(candidate)) {
                return candidate.toAbsolutePath().normalize();
            }
        }
        return Paths.get("public").toAbsolutePath().normalize();
    }

    private static void handleRequest(HttpExchange exchange, Path basePath) {
        try {
            String requestPath = exchange.getRequestURI().getPath();

            if (requestPath == null || requestPath.equals("/") || requestPath.isEmpty()) {
                requestPath = "/index.html";
            }

            // Prevent path traversal attacks
            String decodedPath = URLDecoder.decode(requestPath, StandardCharsets.UTF_8);
            if (decodedPath.contains("..") || decodedPath.contains("\\")) {
                sendResponse(exchange, 403, "text/plain; charset=UTF-8", "403 - Forbidden");
                return;
            }

            Path filePath = basePath.resolve(decodedPath.substring(1)).normalize();

            if (!filePath.startsWith(basePath)) {
                sendResponse(exchange, 403, "text/plain; charset=UTF-8", "403 - Forbidden");
                return;
            }

            if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
                sendResponse(exchange, 404, "text/plain; charset=UTF-8", "404 - File Not Found");
                return;
            }

            String contentType = getContentType(filePath);
            byte[] fileBytes = Files.readAllBytes(filePath);

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.getResponseHeaders().set("Cache-Control", "no-cache, no-store, must-revalidate");
            exchange.sendResponseHeaders(200, fileBytes.length);

            try (OutputStream output = exchange.getResponseBody()) {
                output.write(fileBytes);
            }

        } catch (Exception e) {
            try {
                sendResponse(exchange, 500, "text/plain; charset=UTF-8", "500 - Internal Server Error");
            } catch (IOException ignored) {
                System.err.println("Request error: " + e.getMessage());
            }
        }
    }

    private static String getContentType(Path filePath) {
        String fileName = filePath.getFileName().toString().toLowerCase();
        if (fileName.endsWith(".html")) return "text/html; charset=UTF-8";
        if (fileName.endsWith(".css")) return "text/css; charset=UTF-8";
        if (fileName.endsWith(".js")) return "application/javascript; charset=UTF-8";
        if (fileName.endsWith(".json")) return "application/json; charset=UTF-8";
        if (fileName.endsWith(".png")) return "image/png";
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
        if (fileName.endsWith(".webp")) return "image/webp";
        if (fileName.endsWith(".svg")) return "image/svg+xml";
        if (fileName.endsWith(".ico")) return "image/x-icon";
        return "application/octet-stream";
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String contentType, String message) throws IOException {
        byte[] response = message.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(statusCode, response.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(response);
        }
    }
}
