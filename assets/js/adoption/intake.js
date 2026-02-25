document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('intakeModal');
    const openBtn = document.querySelector('.intake_3 button'); 
    const closeBtn = document.querySelector('.close-btn');    
    const intakeForm = document.getElementById('intakeForm');

    if (openBtn && modal) {
        openBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; 
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    if (intakeForm) {
        intakeForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            alert('제출이 완료되었습니다.');
            
            modal.style.display = 'none';   
            document.body.style.overflow = 'auto';
            intakeForm.reset();            
        });
    }
});