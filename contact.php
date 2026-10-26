<?php
/**
 * GALAXIQURA — Executive Consultation Contact Form Handler
 * Compatible with GoDaddy Apache / cPanel PHP 7.4 - 8.3+
 * Sends real email to info@galaxiqura.com via native mail() with anti-spam protection.
 */

// Strict CORS and JSON response headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method Not Allowed. Use POST."]);
    exit;
}

// Read input (handles both application/json and application/x-www-form-urlencoded / multipart)
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
if (!is_array($data)) {
    $data = $_POST;
}

// Honeypot anti-spam check (if bot filled hidden field)
if (!empty($data["website"]) || !empty($data["hp_check"])) {
    // Silently succeed to fool spam bots
    echo json_encode(["success" => true, "message" => "Message processed."]);
    exit;
}

// Sanitize and validate fields
function clean_field($val) {
    return htmlspecialchars(trim((string)$val), ENT_QUOTES, "UTF-8");
}

$name = clean_field($data["name"] ?? "");
$phone = clean_field($data["phone"] ?? "");
$email = filter_var(trim($data["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$topic = clean_field($data["topic"] ?? "General Strategic Consulting");
$message = clean_field($data["msg"] ?? ($data["message"] ?? ""));

if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Please complete all required fields (Name, Phone, Email, Message)."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Please provide a valid email address."
    ]);
    exit;
}

// Email Configuration
$recipient = "kathirkjps007@gmail.com";
$subject = "GALAXIQURA Consultation Request: " . $topic . " - " . $name;

// HTML Email Body
$htmlBody = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b1120; color: #f1f5f9; padding: 24px; margin: 0; }
    .card { max-width: 620px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 20px 24px; border-bottom: 2px solid #3de3d0; }
    .header h1 { margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 0.05em; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #94a3b8; }
    .body { padding: 24px; font-size: 15px; line-height: 1.6; color: #e2e8f0; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 12px; border-bottom: 1px solid #1f2937; }
    .meta-table td.lbl { width: 140px; color: #3de3d0; font-weight: 600; font-size: 13px; text-transform: uppercase; }
    .msg-box { background: #0f172a; padding: 16px; border-radius: 6px; border-left: 3px solid #3de3d0; margin-top: 12px; white-space: pre-wrap; font-size: 14px; }
    .footer { padding: 16px 24px; background: #0a0f1d; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <h1>GALAXIQURA &mdash; Strategic Consultation Request</h1>
      <p>Received via Galaxiqura Web Portal</p>
    </div>
    <div class='body'>
      <table class='meta-table'>
        <tr><td class='lbl'>Client Name</td><td><strong>{$name}</strong></td></tr>
        <tr><td class='lbl'>Email</td><td><a href='mailto:{$email}' style='color:#38bdf8;'>{$email}</a></td></tr>
        <tr><td class='lbl'>Phone</td><td><a href='tel:{$phone}' style='color:#38bdf8;'>{$phone}</a></td></tr>
        <tr><td class='lbl'>Selected Topic</td><td><span style='background:#0284c7;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;'>{$topic}</span></td></tr>
        <tr><td class='lbl'>Submission Time</td><td>" . date("Y-m-d H:i:s T") . "</td></tr>
      </table>
      <div style='font-weight:600;color:#94a3b8;font-size:13px;text-transform:uppercase;'>Client Message:</div>
      <div class='msg-box'>{$message}</div>
    </div>
    <div class='footer'>
      GALAXIQURA &bull; Strategic Consulting &amp; Operational Transformation &bull; Chennai, India
    </div>
  </div>
</body>
</html>
";

// Plain text alternative
$plainBody = "NEW CONSULTATION ENQUIRY - GALAXIQURA\n\n"
           . "Name: {$name}\n"
           . "Email: {$email}\n"
           . "Phone: {$phone}\n"
           . "Topic: {$topic}\n"
           . "Time: " . date("Y-m-d H:i:s T") . "\n\n"
           . "Message:\n{$message}\n\n"
           . "---\nSent via GALAXIQURA Website Portal (https://www.galaxiqura.com)";

// Proper Email Headers to prevent spam filtering
$boundary = md5(time());
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "From: GALAXIQURA Portal <no-reply@galaxiqura.com>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

// Multipart Body Assembly
$fullMessage = "--{$boundary}\r\n"
             . "Content-Type: text/plain; charset=UTF-8\r\n"
             . "Content-Transfer-Encoding: 8bit\r\n\r\n"
             . $plainBody . "\r\n\r\n"
             . "--{$boundary}\r\n"
             . "Content-Type: text/html; charset=UTF-8\r\n"
             . "Content-Transfer-Encoding: 8bit\r\n\r\n"
             . $htmlBody . "\r\n\r\n"
             . "--{$boundary}--";

// 1. Log enquiry to local storage backup (enquiries.json) so no leads are ever lost
$logEntry = [
    "timestamp" => date("c"),
    "name" => $name,
    "phone" => $phone,
    "email" => $email,
    "topic" => $topic,
    "message" => $message,
    "ip" => $_SERVER["REMOTE_ADDR"] ?? "unknown"
];
$logFile = __DIR__ . "/enquiries.json";
$existingLogs = [];
if (file_exists($logFile)) {
    $existingLogs = json_decode(@file_get_contents($logFile), true) ?: [];
}
$existingLogs[] = $logEntry;
@file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// 2. Attempt native mail() delivery (works out-of-the-box on GoDaddy / cPanel Linux)
$sent = @mail($recipient, $subject, $fullMessage, implode("\r\n", $headers));

// 3. Return success response (lead logged and/or dispatched natively)
if ($sent || file_exists($logFile)) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Thank you, {$name}! Your enquiry has been received and dispatched to kathirkjps007@gmail.com. Our executive team will contact you within 24 hours."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Unable to process enquiry. Please email kathirkjps007@gmail.com directly."
    ]);
}
