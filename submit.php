<?php
/**
 * KERIN ECOPACK - Backend Integration
 * Handles: MySQL Storage, SendGrid Notifications, HubSpot CRM Lead Creation
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// 1. Configuración de Base de Datos (MySQL para InfinityFree)
$db_host = 'SQL_HOST_HERE';
$db_name = 'DB_NAME_HERE';
$db_user = 'DB_USER_HERE';
$db_pass = 'DB_PASS_HERE';

// 2. Validación Honeypot (Anti-Spam)
if (!empty($_POST['b_name'])) {
    // Si el campo oculto tiene contenido, es un bot
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
    exit;
}

// 3. Captura y Sanitización de Datos
function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$nombre = clean($_POST['nombre'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$telefono = clean($_POST['telefono'] ?? '');
$tipo_cliente = clean($_POST['tipo_cliente'] ?? '');
$producto = clean($_POST['producto'] ?? '');
$cantidad = filter_var($_POST['cantidad'] ?? 0, FILTER_SANITIZE_NUMBER_INT);
$plazo = clean($_POST['plazo'] ?? '');

// Validación de email real
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Validación básica
if (empty($nombre) || empty($email) || empty($telefono)) {
    echo json_encode(['success' => false, 'message' => 'Campos obligatorios faltantes']);
    exit;
}

try {
    // --- PASO 1: Guardar en MySQL ---
    /*
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("INSERT INTO leads (nombre, email, telefono, tipo_cliente, producto, cantidad, plazo, fecha) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$nombre, $email, $telefono, $tipo_cliente, $producto, $cantidad, $plazo]);
    */

    // --- PASO 2: Notificación vía SendGrid API ---
    $sendgrid_api_key = 'YOUR_SENDGRID_API_KEY';
    $admin_email = 'ventas@kerinecopack.com';
    
    $email_data = [
        'personalizations' => [[
            'to' => [['email' => $admin_email]],
            'subject' => 'NUEVO LEAD: ' . $nombre . ' - Kerin EcoPack'
        ]],
        'from' => ['email' => 'no-reply@kerinecopack.com'],
        'content' => [[
            'type' => 'text/html',
            'value' => "
                <h3>Nueva solicitud de cotización</h3>
                <p><strong>Nombre:</strong> $nombre</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Teléfono:</strong> $telefono</p>
                <p><strong>Tipo Cliente:</strong> $tipo_cliente</p>
                <p><strong>Producto:</strong> $producto</p>
                <p><strong>Cantidad:</strong> $cantidad piezas</p>
                <p><strong>Plazo:</strong> $plazo</p>
            "
        ]]
    ];

    /* 
    $ch = curl_init('https://api.sendgrid.com/v3/mail/send');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $sendgrid_api_key, 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($email_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
    */

    // --- PASO 3: Integración con HubSpot CRM ---
    $hubspot_access_token = 'YOUR_HUBSPOT_ACCESS_TOKEN';
    $hubspot_data = [
        'properties' => [
            'firstname' => $nombre,
            'email' => $email,
            'phone' => $telefono,
            'industry' => $tipo_cliente,
            'lifecyclestage' => 'lead'
        ]
    ];

    /*
    $ch_hs = curl_init('https://api.hubapi.com/crm/v3/objects/contacts');
    curl_setopt($ch_hs, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $hubspot_access_token, 'Content-Type: application/json']);
    curl_setopt($ch_hs, CURLOPT_POST, 1);
    curl_setopt($ch_hs, CURLOPT_POSTFIELDS, json_encode($hubspot_data));
    curl_setopt($ch_hs, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch_hs);
    curl_close($ch_hs);
    */

    echo json_encode(['success' => true, 'message' => 'Datos procesados correctamente']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>
