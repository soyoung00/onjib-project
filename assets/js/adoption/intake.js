
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('intakeModal');
    const intakeForm = document.getElementById('intakeForm');
    const openBtn = document.querySelector('.intake_3 button'); 
    const closeBtn = document.querySelector('.close-btn');    
    const telInput = document.querySelector('.tel-input');

    if (openBtn && modal) {
        openBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
        });
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        intakeForm.reset(); 
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    if (telInput) {
        telInput.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9]/g, ''); 
            
            if (val.length <= 3) {
                this.value = val;
            } else if (val.length <= 7) {
                this.value = val.substring(0, 3) + '-' + val.substring(3);
            } else {
                this.value = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
            }
        });
    }

    if (intakeForm) {
        intakeForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
  
            const telValue = telInput.value;
            const telPattern = /^01[016789]-\d{3,4}-\d{4}$/;

            if (!telPattern.test(telValue)) {
                alert('전화번호 형식이 올바르지 않습니다. 다시 확인해 주세요.');
                telInput.focus(); 
                return; 
            }

          
            alert('제출이 완료되었습니다.');
            
            modal.style.display = 'none';   
            document.body.style.overflow = 'auto';
            intakeForm.reset();             

            window.location.href = 'index.html'; 
        });
    }
});