<?php
header("Access-Control-Allow-Origin: http://localhost:8081"); // Update with your correct URL
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "swap";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Handle different request methods
$requestMethod = $_SERVER['REQUEST_METHOD'];

switch ($requestMethod) {
    case 'GET':
        // Fetch items
        $sql = "SELECT id, title, description, address, image, betterItem FROM items"; // Adjust the column names as necessary
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $items = [];

            while ($row = $result->fetch_assoc()) {
                // Include the full image URL
                $row['image'] = $row['image'] ? 'http://192.168.0.104/CSwap/uploads/' . $row['image'] : null;
                $items[] = $row;
            }

            echo json_encode($items);
        } else {
            echo json_encode([]);
        }
        break;

    case 'POST':
    case 'PUT':
        // Save or update item
        $title = $_POST['title'];
        $description = $_POST['description'];
        $address = $_POST['address'];
        $betterItem = $_POST['betterItem'];
        $image = isset($_FILES['image']) ? $_FILES['image']['name'] : '';

        if ($image) {
            $target_dir = "uploads/";
            $target_file = $target_dir . basename($_FILES["image"]["name"]);
            move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);

            $imageUrl = $image;
        } else {
            $imageUrl = '';
        }

        if ($requestMethod === 'PUT') {
            $id = $_GET['id'];
            $sql = "UPDATE items SET title='$title', description='$description', address='$address', betterItem='$betterItem', image='$imageUrl' WHERE id=$id";
        } else {
            $sql = "INSERT INTO items (title, description, address, betterItem, image) 
                    VALUES ('$title', '$description', '$address', '$betterItem', '$imageUrl')";
        }

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to save item']);
        }
        break;

    case 'DELETE':
        // Delete item
        $id = $_GET['id'];
        $sql = "DELETE FROM items WHERE id=$id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to delete item']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}

$conn->close();
?>
