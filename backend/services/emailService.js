// services/emailService.js
import nodemailer from 'nodemailer';

// Configurar el transporter para Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Plantilla para recuperación de contraseña
export const sendPasswordResetEmail = async (email, resetToken, nombre) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Sistema de Recolección" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Recuperación de Contraseña - Sistema de Recolección',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    background-color: #f7fafc; 
                    margin: 0; 
                    padding: 20px; 
                    line-height: 1.6;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 0; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header { 
                    background: linear-gradient(135deg, #10b981, #059669); 
                    padding: 30px 20px; 
                    text-align: center; 
                    color: white; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 24px; 
                    font-weight: bold;
                }
                .content { 
                    padding: 30px; 
                    color: #374151;
                }
                .button { 
                    display: inline-block; 
                    padding: 14px 32px; 
                    background: #10b981; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    font-weight: bold;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                .button:hover {
                    background: #059669;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    color: #6b7280; 
                    font-size: 14px; 
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                }
                .token-box { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 8px; 
                    margin: 15px 0; 
                    border-left: 4px solid #10b981;
                    word-break: break-all;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                }
                .warning {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    padding: 12px;
                    border-radius: 6px;
                    margin: 15px 0;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>♻️ Sistema de Recolección Ecológica</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Recuperación de Contraseña</p>
                </div>
                <div class="content">
                    <p>Hola <strong style="color: #059669;">${nombre}</strong>,</p>
                    
                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón siguiente para crear una nueva contraseña:</p>
                    
                    <div style="text-align: center;">
                        <a href="${resetUrl}" class="button">🔑 Restablecer Contraseña</a>
                    </div>
                    
                    <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                    <div class="token-box">${resetUrl}</div>
                    
                    <div class="warning">
                        <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por seguridad.
                    </div>
                    
                    <p>Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura. Tu cuenta permanecerá protegida.</p>
                    
                    <p>Saludos cordiales,<br>
                    <strong>Equipo de Sistema de Recolección</strong></p>
                </div>
                <div class="footer">
                    <p>© 2024 Sistema de Recolección y Reciclaje EcoRutas. Todos los derechos reservados.</p>
                    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    console.log("📧 Enviando email a:", email);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperación enviado correctamente:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return false;
  }
};

// Plantilla para recuperación de usuario
export const sendUsernameRecoveryEmail = async (email, nombre) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Sistema de Recolección" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '👤 Tu Nombre de Usuario - Sistema de Recolección',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    background-color: #f7fafc; 
                    margin: 0; 
                    padding: 20px; 
                    line-height: 1.6;
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 0; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header { 
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                    padding: 30px 20px; 
                    text-align: center; 
                    color: white; 
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 24px; 
                    font-weight: bold;
                }
                .content { 
                    padding: 30px; 
                    color: #374151;
                }
                .username-box { 
                    background: #f0f9ff; 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    text-align: center; 
                    border: 2px solid #3b82f6;
                    font-size: 20px; 
                    font-weight: bold; 
                    color: #1e40af;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    color: #6b7280; 
                    font-size: 14px; 
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                }
                .info-box {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                    border-left: 4px solid #3b82f6;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>♻️ Sistema de Recolección Ecológica</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Recuperación de Usuario</p>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    
                    <p>Has solicitado recuperar tu nombre de usuario. Aquí está la información de tu cuenta:</p>
                    
                    <div class="username-box">
                        👤 Tu nombre de usuario:<br>
                        <strong style="font-size: 24px;">${nombre}</strong>
                    </div>
                    
                    <div class="info-box">
                        <strong>💡 Recordatorio:</strong> Usa este nombre de usuario junto con tu contraseña para iniciar sesión en nuestro sistema.
                    </div>
                    
                    <p>Si no solicitaste esta información, te recomendamos mantenerla segura y considerar cambiar tu contraseña.</p>
                    
                    <p>Saludos cordiales,<br>
                    <strong>Equipo de Sistema de Recolección</strong></p>
                </div>
                <div class="footer">
                    <p>© 2024 Sistema de Recolección y Reciclaje EcoRutas. Todos los derechos reservados.</p>
                    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    console.log("📧 Enviando email de usuario a:", email);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de usuario enviado correctamente:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de usuario:', error);
    return false;
  }
};