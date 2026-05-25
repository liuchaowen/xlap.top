/**
 * GSAP 动画模块 — 张国荣纪念网站
 * 入场动画、鼠标视差、烟火粒子、抽屉动画、呼吸效果
 * 如果 GSAP 未加载，所有动画静默跳过，页面正常显示
 */

(function () {
    "use strict";

    if (typeof gsap === "undefined") return;

    // ─── 入场动画 ───────────────────────────────────────────
    function initEntrance() {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Hero 区域淡入 + 上移
        tl.from(".hero-section", {
            autoAlpha: 0,
            y: 40,
            duration: 1.5
        });

        // 打字机文字（与原有 JS 打字效果配合，只做淡入）
        tl.from(".typing-text", {
            autoAlpha: 0,
            duration: 0.4
        }, "<");

        // WB 图标弹出
        tl.from(".wb-icon", {
            autoAlpha: 0,
            scale: 0,
            rotation: -90,
            duration: 0.5,
            ease: "back.out(2)"
        }, "+=2.4");

        // 副标题滑入
        tl.from(".subtitle", {
            autoAlpha: 0,
            y: 30,
            duration: 1,
            ease: "power2.out"
        }, "-=0.3");

        // 纪念文字区域滑入
        tl.from(".memorial-text", {
            autoAlpha: 0,
            y: 40,
            duration: 1.2,
            ease: "power2.out"
        }, "-=0.5");

        // 纪念文字内部逐行显示
        tl.from(".dates", {
            autoAlpha: 0,
            x: -30,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6");
        tl.from(".quote", {
            autoAlpha: 0,
            x: 30,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4");

        // 音乐播放器弹出（不覆盖 translateX(-50%) 居中）
        tl.from(".music-player-inner", {
            autoAlpha: 0,
            scale: 0.85,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.3");

        // 底部信息淡入（不覆盖 translateX(-50%) 居中）
        tl.from(".footer p", {
            autoAlpha: 0,
            y: 10,
            duration: 0.8
        }, "-=0.3");

        return tl;
    }

    // ─── 鼠标视差 ───────────────────────────────────────────
    function initParallax() {
        const hero = document.querySelector(".hero-section");
        const memorial = document.querySelector(".memorial-text");

        if (!hero) return;

        let xTo = gsap.quickTo(hero, "x", { duration: 0.6, ease: "power3" });
        let yTo = gsap.quickTo(hero, "y", { duration: 0.6, ease: "power3" });

        if (memorial) {
            let memXTo = gsap.quickTo(memorial, "x", { duration: 0.8, ease: "power3" });
            let memYTo = gsap.quickTo(memorial, "y", { duration: 0.8, ease: "power3" });

            document.addEventListener("mousemove", function (e) {
                const cx = (e.clientX / window.innerWidth - 0.5) * 2;
                const cy = (e.clientY / window.innerHeight - 0.5) * 2;
                xTo(cx * 12);
                yTo(cy * 8);
                memXTo(cx * -6);
                memYTo(cy * -4);
            });
        } else {
            document.addEventListener("mousemove", function (e) {
                const cx = (e.clientX / window.innerWidth - 0.5) * 2;
                const cy = (e.clientY / window.innerHeight - 0.5) * 2;
                xTo(cx * 12);
                yTo(cy * 8);
            });
        }
    }

    // ─── 烟火粒子系统 ────────────────────────────────────────
    function initParticles() {
        const canvas = document.getElementById("particleCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let particles = [];
        let animId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        const COLORS = [
            "rgba(239,146,181,0.8)",
            "rgba(239,146,181,0.5)",
            "rgba(255,200,220,0.7)",
            "rgba(255,220,240,0.4)",
            "rgba(200,100,140,0.6)",
            "rgba(255,180,200,0.3)",
            "rgba(255,255,255,0.2)"
        ];

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -(Math.random() * 0.8 + 0.1),
                size: Math.random() * 3 + 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                life: 0,
                lifespan: Math.random() * 8 + 4,
                twinkleSpeed: Math.random() * 0.04 + 0.02,
                twinklePhase: Math.random() * Math.PI * 2
            };
        }

        for (let i = 0; i < 50; i++) {
            const p = createParticle();
            p.life = Math.random() * p.lifespan;
            particles.push(p);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life += 0.016;
                p.x += p.vx;
                p.y += p.vy;

                const twinkle = Math.sin(p.life * p.twinkleSpeed * 60 + p.twinklePhase);
                const alpha = Math.max(0, 1 - p.life / p.lifespan) * (0.5 + 0.5 * twinkle);

                if (p.life >= p.lifespan) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(/[\d.]+\)$/, alpha.toFixed(2) + ")");
                ctx.fill();

                if (p.size > 2) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = p.color.replace(/[\d.]+\)$/, (alpha * 0.12).toFixed(2) + ")");
                    ctx.fill();
                }
            }

            if (particles.length < 60 && Math.random() > 0.7) {
                particles.push(createParticle());
            }

            animId = requestAnimationFrame(draw);
        }

        draw();

        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
                cancelAnimationFrame(animId);
            } else {
                draw();
            }
        });
    }

    // ─── 抽屉电影列表交错动画 ──────────────────────────────
    function initDrawerAnimations() {
        const drawer = document.getElementById("movieDrawer");
        if (!drawer) return;

        const observer = new MutationObserver(function () {
            if (drawer.classList.contains("open")) {
                // 用 opacity（不设 visibility:hidden）避免与 CSS transition 冲突
                gsap.fromTo(".movie-item", {
                    opacity: 0,
                    x: -25
                }, {
                    opacity: 1,
                    x: 0,
                    stagger: 0.06,
                    duration: 0.35,
                    ease: "power2.out",
                    delay: 0.25,
                    overwrite: true
                });
            }
        });
        observer.observe(drawer, { attributes: true, attributeFilter: ["class"] });
    }

    // ─── 音乐播放器呼吸动画 ──────────────────────────────────
    function initMusicPlayerAnimation() {
        const playerInner = document.querySelector(".music-player-inner");
        const musicIconSvg = document.querySelector(".music-icon svg");
        if (!playerInner || !musicIconSvg) return;

        const glowTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
        glowTl.to(playerInner, {
            boxShadow: "0 0 20px rgba(239,146,181,0.4), 0 0 40px rgba(239,146,181,0.15)",
            borderColor: "rgba(239,146,181,0.5)",
            duration: 1.5,
            ease: "sine.inOut"
        });

        let spinAnim = gsap.to(musicIconSvg, {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: "none",
            paused: true
        });

        function checkPlayState() {
            const pauseBtn = document.getElementById("musicPauseBtn");
            const isPlaying = pauseBtn && !pauseBtn.classList.contains("hidden");
            if (isPlaying) {
                glowTl.play();
                spinAnim.play();
            } else {
                glowTl.pause();
                spinAnim.pause();
            }
        }

        setInterval(checkPlayState, 500);
    }

    // ─── 呼吸效果 ──────────────────────────────────────
    function initBreathingEffects() {
        gsap.to(".subtitle", {
            letterSpacing: "0.5em",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.to(".memorial-text", {
            borderColor: "rgba(239,146,181,0.3)",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // ─── 视频色调缓动 ──────────────────────────────────────
    function initVideoFilter() {
        const video = document.getElementById("bgVideo");
        if (!video) return;

        gsap.to(video, {
            filter: "grayscale(80%) brightness(0.65)",
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // ─── Quote 特效 ─────────────────────────────────────────
    function initQuoteEffect() {
        const quote = document.querySelector(".quote");
        if (!quote) return;

        gsap.to(quote, {
            textShadow: "2px 2px 8px rgba(239,146,181,0.4)",
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // ─── 语言切换器动画 ──────────────────────────────────────
    function initLanguageSwitcherAnimation() {
        const label = document.querySelector(".lang-label");
        if (!label) return;

        gsap.from(".language-switcher", {
            autoAlpha: 0,
            y: -20,
            duration: 0.5,
            delay: 2,
            ease: "power2.out"
        });

        label.addEventListener("mouseenter", function () {
            gsap.to(this, { scale: 1.05, duration: 0.2, ease: "power2.out" });
        });
        label.addEventListener("mouseleave", function () {
            gsap.to(this, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
    }

    // ─── 减少动画偏好 ──────────────────────────────────────
    function initReduceMotion() {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: reduce)", function () {
            gsap.killTweensOf(".subtitle");
            gsap.killTweensOf(".memorial-text");
            gsap.killTweensOf("#bgVideo");
            gsap.killTweensOf(".quote");
            gsap.killTweensOf(".music-player-inner");
        });
    }

    // ─── 初始化 ──────────────────────────────────────────────
    window.addEventListener("load", function () {
        setTimeout(function () {
            initEntrance();
            initParallax();
            initParticles();
            initDrawerAnimations();
            initMusicPlayerAnimation();
            initBreathingEffects();
            initVideoFilter();
            initQuoteEffect();
            initLanguageSwitcherAnimation();
            initReduceMotion();
        }, 100);
    });
})();