import re

with open('test.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update version tag to 19.15 (TEST)
content = content.replace('v19.12</title>', 'v19.15 (TEST)</title>')
content = content.replace('v19.12</div>', 'v19.15 (TEST)</div>')

# 2. Add .ni-box CSS
old_css_target = "        .timer-box {"
ni_css = """        /* ИНДИКАТОРЫ НОЗДРЕЙ */
        .ni-box {
            position: absolute; top: 50%;
            display: -webkit-flex; display: flex;
            -webkit-flex-direction: column; flex-direction: column;
            -webkit-align-items: center; align-items: center;
            color: var(--gold); opacity: 0.15;
            -webkit-transition: opacity 0.4s; transition: opacity 0.4s;
            z-index: 10; pointer-events: none;
        }
        .ni-box.active { opacity: 1; }
        .ni-box.dim { opacity: 0.15; }
        .ni-l { left: -15%; -webkit-transform: translateY(-50%); transform: translateY(-50%); }
        .ni-r { right: -15%; -webkit-transform: translateY(-50%); transform: translateY(-50%); }
        
        .ni-arrow-svg {
            width: 24px; height: 24px; margin-bottom: 2px;
        }
        .ni-arrow-svg.down { -webkit-transform: rotate(180deg); transform: rotate(180deg); }
        .ni-letter { font-size: 1.2rem; font-weight: 200; letter-spacing: 0.05em; }

        .timer-box {"""
content = content.replace(old_css_target, ni_css)

# 3. Remove transitions from lines
old_trans1 = "opacity: 0;\n            -webkit-transition: stroke-dashoffset 0.1s linear, opacity 0.2s;\n            transition: stroke-dashoffset 0.1s linear, opacity 0.2s;"
new_trans1 = "opacity: 0;\n            -webkit-transition: opacity 0.2s;\n            transition: opacity 0.2s;"
content = content.replace(old_trans1, new_trans1)

old_trans2 = "-webkit-transform: scale(1.05); transform: scale(1.05);\n            -webkit-transition: -webkit-transform 0.3s ease-out;\n            transition: transform 0.3s ease-out;"
new_trans2 = "-webkit-transform: scale(1.05); transform: scale(1.05);"
content = content.replace(old_trans2, new_trans2)

# 4. Enhance Aura
content = content.replace('--aura-color: rgba(194, 160, 94, 0.1);', '--aura-color: rgba(194, 160, 94, 0.25);')
content = content.replace('--aura-color: rgba(212, 175, 55, 0.15);', '--aura-color: rgba(212, 175, 55, 0.30);')

# 5. Add Nostril HTML
old_html_target = '<svg class="triangle-svg" id="triangleSvg" viewBox="0 0 500 500">'
ni_html = """<!-- ИНДИКАТОРЫ НОЗДРЕЙ -->
        <div id="niL" class="ni-box ni-l">
            <svg class="ni-arrow-svg" id="arrowL" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="ni-letter">Л</span>
        </div>
        <div id="niR" class="ni-box ni-r">
            <svg class="ni-arrow-svg" id="arrowR" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="ni-letter">П</span>
        </div>

        <svg class="triangle-svg" id="triangleSvg" viewBox="0 0 500 500">"""
content = content.replace(old_html_target, ni_html)

# 6. JS State and els
content = content.replace("triangleSvg: document.getElementById('triangleSvg')", "triangleSvg: document.getElementById('triangleSvg'),\n        niL: document.getElementById('niL'),\n        niR: document.getElementById('niR'),\n        arrowL: document.getElementById('arrowL'),\n        arrowR: document.getElementById('arrowR')")
content = content.replace("night: false, lastTick: 0", "night: false, lastTick: 0, nostrilMode: 'L'")

# 7. JS Logics
# In handleStart
content = content.replace("state.curRep = 1;\n            document.body.classList.add('running');", "state.curRep = 1; state.nostrilMode = 'L';\n            document.body.classList.add('running');")

# In handleReset
content = content.replace("els.triangleSvg.style.transform = 'scale(1.05)';\n        releaseWakeLock();", "els.triangleSvg.style.transform = 'scale(1.05)';\n        els.niL.classList.remove('active', 'dim'); els.niR.classList.remove('active', 'dim');\n        releaseWakeLock();")

# In runIdx and updateNostrilVisuals
old_runIdx_part = """    function runIdx(idx) {
        if(idx >= 4) {
            // Круг завершен! Добавляем статистику.
            appStats.totalCycles++;
            localStorage.setItem('mb_total_cycles', appStats.totalCycles);
            if (state.curRep > appStats.maxCycles) {
                appStats.maxCycles = state.curRep;
                localStorage.setItem('mb_max_cycles', appStats.maxCycles);
            }
            if (statModes[currentStatIdx].id === 'cycles' || statModes[currentStatIdx].id === 'max') renderStatText();

            if(state.curRep < state.reps) { 
                state.curRep++; 
                renderDots(); 
                playSingingBowl(4); 
                runIdx(0); 
            } else { 
                done(); 
            }
            return;
        }
        state.idx = idx; state.dur = (idx===3 ? 0.2 : state.ints[idx]) * 1000;
        state.timeLeft = state.dur;
        var labels = ["Вдох","Задержка","Выдох","Пауза"];
        els.statusText.textContent = labels[idx];
        if(idx<3) playSingingBowl(idx);
        state.lastTick = performance.now(); requestAnimationFrame(engine);
    }"""

new_runIdx_part = """    function runIdx(idx) {
        if(idx >= 4) {
            if(state.nostrilMode === 'L') { 
                state.nostrilMode = 'R'; 
                runIdx(0); 
            } else {
                state.nostrilMode = 'L';
                appStats.totalCycles++;
                localStorage.setItem('mb_total_cycles', appStats.totalCycles);
                if (state.curRep > appStats.maxCycles) {
                    appStats.maxCycles = state.curRep;
                    localStorage.setItem('mb_max_cycles', appStats.maxCycles);
                }
                if (statModes[currentStatIdx].id === 'cycles' || statModes[currentStatIdx].id === 'max') renderStatText();

                if(state.curRep < state.reps) { 
                    state.curRep++; 
                    renderDots(); 
                    playSingingBowl(4); 
                    runIdx(0); 
                } else { 
                    done(); 
                }
            }
            return;
        }
        state.idx = idx; state.dur = (idx===3 ? 0.2 : state.ints[idx]) * 1000;
        state.timeLeft = state.dur;
        
        updateNostrilVisuals();
        var labels = ["Вдох","Задержка","Выдох","Пауза"];
        els.statusText.textContent = labels[idx];
        
        if(idx<3) playSingingBowl(idx);
        state.lastTick = performance.now(); requestAnimationFrame(engine);
    }
    
    function updateNostrilVisuals() {
        els.niL.classList.remove('active', 'dim'); els.niR.classList.remove('active', 'dim');
        
        if (state.idx === 3) return;
        
        if (state.idx === 0) { // ВДОХ
            if(state.nostrilMode === 'L') { 
                els.niL.classList.add('active'); els.arrowL.classList.remove('down'); 
                els.niR.classList.add('dim'); els.arrowR.classList.add('down'); 
            } else { 
                els.niR.classList.add('active'); els.arrowR.classList.remove('down'); 
                els.niL.classList.add('dim'); els.arrowL.classList.add('down'); 
            }
        } else if (state.idx === 2) { // ВЫДОХ
            if(state.nostrilMode === 'L') { 
                els.niR.classList.add('active'); els.arrowR.classList.add('down'); 
                els.niL.classList.add('dim'); els.arrowL.classList.remove('down'); 
            } else { 
                els.niL.classList.add('active'); els.arrowL.classList.add('down'); 
                els.niR.classList.add('dim'); els.arrowR.classList.remove('down'); 
            }
        }
    }"""
content = content.replace(old_runIdx_part, new_runIdx_part)

# In engine, updateEdges needs to pass progress
content = content.replace("updateEdges((state.timeLeft/state.dur)*100);", "updateEdges(progress);")

# Update updateEdges signature
old_updateEdges = """    function updateEdges(pct) {
        var p = 1-(pct/100);
        if(state.idx===0) {
            els.edges[0].style.opacity=1; els.edges[0].style.strokeDashoffset=edgeLengths[0]-(p*edgeLengths[0]);
            els.edges[1].style.opacity=0; els.edges[2].style.opacity=0;
        } else if(state.idx===1) {
            els.edges[0].style.opacity=1; els.edges[0].style.strokeDashoffset=0;
            els.edges[1].style.opacity=1; els.edges[1].style.strokeDashoffset=edgeLengths[1]-(p*edgeLengths[1]);
            els.edges[2].style.opacity=0;
        } else if(state.idx===2) {
            els.edges[0].style.opacity=1; els.edges[0].style.strokeDashoffset=0;
            els.edges[1].style.opacity=1; els.edges[1].style.strokeDashoffset=0;
            els.edges[2].style.opacity=1; els.edges[2].style.strokeDashoffset=edgeLengths[2]-(p*edgeLengths[2]);
        }
    }"""

new_updateEdges = """    function updateEdges(progress) {
        if(state.idx===0) {
            els.edges[0].style.opacity=1; els.edges[0].style.strokeDashoffset=edgeLengths[0] - (progress*edgeLengths[0]);
            els.edges[1].style.opacity=0; els.edges[2].style.opacity=0;
        } else if(state.idx===1) {
            els.edges[0].style.opacity=1; els.edges[0].style.strokeDashoffset=0;
            els.edges[1].style.opacity=1; els.edges[1].style.strokeDashoffset=edgeLengths[1] - (progress*edgeLengths[1]);
            els.edges[2].style.opacity=0;
        } else if(state.idx===2) {
            els.edges[0].style.opacity=1; els.edges[0].style.strokeDashoffset=0;
            els.edges[1].style.opacity=1; els.edges[1].style.strokeDashoffset=0;
            els.edges[2].style.opacity=1; els.edges[2].style.strokeDashoffset=edgeLengths[2] - (progress*edgeLengths[2]);
        }
    }"""
content = content.replace(old_updateEdges, new_updateEdges)

with open('test.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to test.html successfully")
