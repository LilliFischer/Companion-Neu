window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
  
    const steps = document.querySelectorAll(".step");
  
    // berechne Phase (0–3), z.B. Phase 0 = erste Info
    let phase = Math.floor(scrollY / windowH);
  
    // Begrenzen, damit nicht über 2 (3 Infos) hinaus
    if (phase < 0) phase = 0;
    if (phase > steps.length - 1) phase = steps.length - 1;
  
    // alle unsichtbar
    steps.forEach(s => s.classList.remove("active"));
  
   // NEU: Alle Punkte von Index 0 bis zur aktuellen Phase sichtbar machen
   for (let i = 0; i <= phase; i++) {
    steps[i].classList.add("active");
   }
  });
  