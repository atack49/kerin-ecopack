// KERIN ECOPACK - Frontend Logic
document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');

    // Form Submission Logic
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Honeypot Check (Frontend safety)
        if (leadForm.querySelector('input[name="b_name"]').value !== '') {
            return;
        }

        const submitBtn = leadForm.querySelector('button');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;

        const formData = new FormData(leadForm);

        try {
            const response = await fetch('submit.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Mejora de Feedback: Fade-out del formulario y mensaje premium
                leadForm.style.transition = 'opacity 0.5s ease';
                leadForm.style.opacity = '0';
                
                setTimeout(() => {
                    leadForm.style.display = 'none';
                    formStatus.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h2>¡Gracias por elegir EcoPack!</h2>
                            <p style="font-size: 1.2rem; opacity: 0.9;">Hemos recibido tu solicitud. Un asesor comercial especializado en tu sector se pondrá en contacto contigo en breve para enviarte la propuesta.</p>
                            <button onclick="location.reload()" class="btn-primary" style="margin-top: 30px; background: white; color: var(--primary);">Volver al inicio</button>
                        </div>
                    `;
                    formStatus.style.display = 'block';
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            } else {
                throw new Error(result.message || 'Error al enviar');
            }
        } catch (error) {
            formStatus.style.display = 'block';
            formStatus.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
            formStatus.style.color = '#fff';
            formStatus.style.border = '1px solid #f44336';
            formStatus.innerHTML = '⚠️ Hubo un problema. Verifica los datos e intenta de nuevo.';
            console.error('Error:', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Privacy Modal Logic
    const modal = document.getElementById('privacyModal');
    const btn = document.getElementById('openPrivacy');
    const span = document.getElementsByClassName('close-modal')[0];

    btn.onclick = (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    }

    span.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.value-card, .catalog-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
