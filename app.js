// KERIN ECOPACK - Frontend Logic
document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Efecto visual de carga
        const submitBtn = leadForm.querySelector('button');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(leadForm);

        try {
            const response = await fetch('submit.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                formStatus.style.color = '#fff';
                formStatus.style.border = '1px solid #4CAF50';
                formStatus.innerHTML = '✅ ¡Solicitud enviada! Te contactaremos en menos de 24 horas.';
                leadForm.reset();
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
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

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
