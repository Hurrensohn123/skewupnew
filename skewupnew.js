// Überprüfen, ob GSAP und ScrollTrigger geladen sind
console.log("GSAP vorhanden:", typeof gsap !== "undefined");
console.log("ScrollTrigger vorhanden:", typeof ScrollTrigger !== "undefined");

// Falls ScrollTrigger nicht erkannt wird, versuche, es explizit mit window zu registrieren
if (typeof gsap !== "undefined") {
    gsap.registerPlugin(window.ScrollTrigger || ScrollTrigger);
}

// Nochmal überprüfen, ob ScrollTrigger nach der Registrierung vorhanden ist
console.log("ScrollTrigger nach Registrierung:", gsap.core.globals().ScrollTrigger);

let addAnimation = function () {
  $(".skew-up").each(function (index) {
    const element = $(this)[0];

    // Sicherstellen, dass SplitType korrekt initialisiert wird
    const text = new SplitType(element, {
      types: "lines, words",
      lineClass: "word-line"
    });

    let textInstance = $(this);
    let line = textInstance.find(".word-line");
    if (line.length === 0) return;
    let word = line.find(".word");
    if (word.length === 0) return;

    let delay = textInstance.attr('id') === 'delay-skew' ? 3.5 : 0.5;

    // Sicherstellen, dass das Element sichtbar ist (SVG-Fix)
    textInstance.css("height", "auto");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: textInstance,
              start: "top 85%",
              end: "top 85%",
              scrub: false,
              onComplete: function () {
                textInstance.removeClass("skew-up");
              }
            }
          });

          tl.set(textInstance, { opacity: 1 })
            .from(word, {
              y: "100%",
              skewX: "-6",
              duration: 2,
              stagger: 0.03,
              ease: "expo.out",
              delay: delay
            });

          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(element);
  });
};

addAnimation();

// Resize-Optimierung mit Timeout
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if ($(window).width() >= 992) {
      addAnimation();
    }
  }, 300);
});
