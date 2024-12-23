<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT,POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost"; // Your database server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "swap"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod === "GET") {
    // Fetch user profile
    $sql = "SELECT email, username, address FROM register WHERE id = 9"; // Replace with user ID logic
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "No user found."]);
    }
} elseif ($requestMethod === "PUT") {
    // Update user profile
    $input = json_decode(file_get_contents("php://input"), true);

    $email = $conn->real_escape_string($input["email"]);
    $username = $conn->real_escape_string($input["username"]);
    $address = $conn->real_escape_string($input["address"]);

    $sql = "UPDATE register SET email='$email', username='$username', address='$address' WHERE id = 9"; // Replace with user ID logic

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Error updating record: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}

$conn->close();
?>
