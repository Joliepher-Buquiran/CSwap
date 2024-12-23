<?php
header("Access-Control-Allow-Origin: http://localhost:8081");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "swap";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Sanitize input data
    $email = $conn->real_escape_string($data['email']);
    $username = $conn->real_escape_string($data['username']);
    $address = isset($data['address']) ? $conn->real_escape_string($data['address']) : '';
    $password = $conn->real_escape_string($data['password']);
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Check if email already exists
    $query = "SELECT * FROM register WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        echo json_encode(['error' => 'Email already exists']);
    } else {
        // Insert new user into the database
        $query = "INSERT INTO register (email, username, address, password) VALUES ('$email', '$username', '$address', '$hashedPassword')";
        if ($conn->query($query) === TRUE) {
            echo json_encode(['success' => 'User registered successfully']);
        } else {
            echo json_encode(['error' => 'Error: ' . $conn->error]);
        }
    }
}

$conn->close();
?>
