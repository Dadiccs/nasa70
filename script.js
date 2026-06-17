const PRIMARY_URL = "https://ixd-supsi.github.io/n70api/data.json";
        const FALLBACK_URL = "https://cors-anywhere.herokuapp.com/https://ixd-supsi.github.io/n70api/data.json";
        
        let projects = [];
        let featuredProjects = []; 
        let currentStep = 1;
        let selectedAnswers = []; 
        let isCalibrated = false; 

        const MACRO_TAGS = [
            "2D", "3D", "Apollo", "Astronomy", "Audio", "Climate", "Science", 
            "Data visualization", "Earth", "Planet", "Educational", "Game", 
            "History", "Archive", "Robot", "Space"
        ];

        const wizardQuestions = [
            {
                question: "Quale aspetto della documentazione ti affascina di più?",
                options: [
                    { label: "Esplorazione e scoperte", tag: "space" },
                    { label: "Approccio didattico ed educativo", tag: "educational" },
                    { label: "Storia e missioni spaziali", tag: "history" }
                ]
            },
            {
                question: "Su quale focus planetario o ingegneristico preferisci concentrarti?",
                options: [
                    { label: "I rover e i robot terrestri", tag: "robot" },
                    { label: "Il pianeta Marte e i sistemi lunari", tag: "planets" },
                    { label: "Ingegneria spaziale e cosmologia", tag: "science" }
                ]
            },
            {
                question: "Che tipo di media interattivo prediligi explorarare?",
                options: [
                    { label: "Ambienti tridimensionali (3D)", tag: "3d" },
                    { label: "Sistemi e mappature di dati reali", tag: "data visualization" },
                    { label: "Materiale d'archivio e registrazioni storiche", tag: "archive" }
                ]
            }
        ];

        function bypassToFeatured() {
            const landing = document.getElementById('landing-page');
            landing.classList.add('fade-out');

            // Il timeout è stato allineato a 850ms per consentire al logo 
            // di completare la sua transizione ritardata (0.25s delay + 0.5s durata)
            setTimeout(() => {
                landing.style.display = 'none';
                
                const header = document.getElementById('mainHeader');
                const spacer = document.getElementById('headerSpacer');
                const footer = document.getElementById('mainFooter');
                const featuredView = document.getElementById('featured-view');

                header.style.display = 'flex';
                spacer.style.display = 'block';
                footer.style.display = 'block';
                featuredView.style.display = 'block';

                fetchDatabase().then(() => {
                    switchActiveView('featured-view');
                    triggerStaggerAnimation();
                });
            }, 850); 
        }

        function triggerStaggerAnimation() {
            const items = document.querySelectorAll('#featured-view .stagger-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 150); 
            });
        }

        function switchToArchiveAndRunQuiz() {
            switchActiveView('archive-view');
            runQuizInsideArchive();
        }

        function runQuizInsideArchive() {
            isCalibrated = false;
            document.querySelectorAll('.calibration-banner').forEach(el => el.style.display = 'none');
            document.getElementById('archiveRealContent').style.display = 'none';
            document.getElementById('archiveQuizOverlay').style.display = 'block';
            currentStep = 1;
            selectedAnswers = [];
            showStep();
        }

        async function fetchDatabase() {
            if (projects.length > 0) return;
            try {
                let response = await fetch(PRIMARY_URL);
                let data = await response.json();
                projects = data.progetti || data;
                setupViews();
            } catch (e) {
                try {
                    let response = await fetch(FALLBACK_URL);
                    let data = await response.json();
                    projects = data.progetti || data;
                    setupViews();
                } catch (err) {
                    console.error("Database offline");
                }
            }
        }

        function setupViews() {
            buildAndRenderSidebarTags(); 
            
            const shuffled = [...projects].sort(() => 0.5 - Math.random());
            featuredProjects = shuffled.slice(0, 3);
            
            renderFeaturedGrid();
            renderLatestAddition();
        }

        function buildAndRenderSidebarTags() {
            const container = document.getElementById('sidebarTagsContainer');
            container.innerHTML = "";

            MACRO_TAGS.forEach(tag => {
                const chip = document.createElement('div');
                chip.className = `filter-tag-chip mono ${selectedAnswers.includes(tag.toLowerCase()) ? 'active' : ''}`;
                chip.textContent = tag;
                chip.setAttribute('data-tag', tag.toLowerCase());
                chip.title = tag; 
                
                chip.onclick = () => {
                    toggleTagSelection(tag.toLowerCase());
                };

                container.appendChild(chip);
            });
        }

        function toggleTagSelection(tag) {
            const index = selectedAnswers.indexOf(tag);
            if (index > -1) {
                selectedAnswers.splice(index, 1);
            } else {
                selectedAnswers.push(tag);
            }
            syncTagsUI();
            filterAndRenderArchive();
        }

        function syncTagsUI() {
            document.querySelectorAll('.filter-tag-chip').forEach(chip => {
                const tag = chip.getAttribute('data-tag');
                if (selectedAnswers.includes(tag)) {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });
        }

        function renderFeaturedGrid() {
            const featuredGrid = document.getElementById('featuredGrid');
            featuredGrid.innerHTML = "";
            featuredProjects.forEach(p => {
                const card = createCardElement(p, false);
                card.classList.add('stagger-item');
                featuredGrid.appendChild(card);
            });
        }

        function renderLatestAddition() {
            const container = document.getElementById('latestAdditionGrid');
            container.innerHTML = "";
            if (projects.length === 0) return;

            const sortedByDate = [...projects].sort((a, b) => {
                const dateA = a.data ? new Date(a.data.anno, (a.data.mese - 1) || 0, a.data.giorno || 1) : new Date(0);
                const dateB = b.data ? new Date(b.data.anno, (b.data.mese - 1) || 0, b.data.giorno || 1) : new Date(0);
                return dateB - dateA; 
            });

            const itemsToRender = sortedByDate.slice(0, 1);
            itemsToRender.forEach(project => {
                const card = createCardElement(project, true);
                card.classList.add('stagger-item');
                container.appendChild(card);
            });
        }

        function showStep() {
            const qData = wizardQuestions[currentStep - 1];
            document.getElementById('questionText').textContent = qData.question;
            document.getElementById('stepCounter').textContent = `Fase ${currentStep} di 3`;
            document.getElementById('progressBar').style.width = `${(currentStep / 3) * 100}%`;

            const container = document.getElementById('optionsContainer');
            container.innerHTML = "";

            qData.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.style.cssText = "flex: 1; background: var(--card-bg); border: 1px solid var(--border-color); padding: 1.5rem 1rem; color: #ccc; font-family: 'Inter', sans-serif; cursor: pointer; font-size: 0.85rem; min-height: 100px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;";
                btn.textContent = opt.label;
                btn.onclick = () => selectOption(opt.tag.toLowerCase());
                container.appendChild(btn);
            });
        }

        function selectOption(tag) {
            selectedAnswers.push(tag);
            if (currentStep < 3) {
                currentStep++;
                showStep();
            } else {
                isCalibrated = true; 
                endQuizAndRevealArchive();
            }
        }

        function endQuizAndRevealArchive() {
            document.getElementById('archiveQuizOverlay').style.display = 'none';
            document.getElementById('archiveRealContent').style.display = 'block';
            document.querySelectorAll('.calibration-banner').forEach(el => el.style.display = 'none');
            syncTagsUI(); 
            filterAndRenderArchive();
        }

        function switchActiveView(viewId) {
            document.getElementById('landing-page').style.display = 'none';
            document.querySelectorAll('.app-view').forEach(view => {
                view.style.display = 'none';
                view.style.opacity = '0';
            });
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

            const targetView = document.getElementById(viewId);
            targetView.style.display = 'block';
            
            setTimeout(() => {
                targetView.style.opacity = '1';
                document.getElementById('mainHeader').style.opacity = '1';
                document.getElementById('mainFooter').style.opacity = '1';
            }, 50);

            document.getElementById('archiveQuizOverlay').style.display = 'none';
            
            if(viewId === 'featured-view') {
                document.getElementById('link-featured').classList.add('active');
                if (!isCalibrated) {
                    document.querySelectorAll('.calibration-banner').forEach(el => el.style.display = 'block');
                }
                triggerStaggerAnimation();
            } else if(viewId === 'archive-view') {
                document.getElementById('link-archive').classList.add('active');
                document.getElementById('archiveRealContent').style.display = 'block';
                
                if (!isCalibrated) {
                    document.querySelectorAll('.calibration-banner').forEach(el => el.style.display = 'block');
                } else {
                    document.querySelectorAll('.calibration-banner').forEach(el => el.style.none);
                }
                
                syncTagsUI();
                filterAndRenderArchive();
            }
            window.scrollTo(0, 0);
        }

        function filterAndRenderArchive() {
            if (projects.length === 0) return;

            const searchValue = document.getElementById('searchInput').value.toLowerCase();
            const orderValue = document.getElementById('dateOrder').value;

            let filtered = projects.filter(p => {
                const title = (p.titolo || "").toLowerCase();
                const author = (p.autore || "").toLowerCase();
                const matchesSearch = title.includes(searchValue) || author.includes(searchValue);
                
                let matchesTag = true;
                if (selectedAnswers.length > 0) {
                    matchesTag = p.tags && Array.isArray(p.tags) && p.tags.some(t => {
                        return selectedAnswers.includes(t.trim().toLowerCase());
                    });
                }
                return matchesSearch && matchesTag;
            });

            filtered.sort((a, b) => {
                const dateA = a.data ? new Date(a.data.anno, (a.data.mese - 1) || 0, a.data.giorno || 1) : new Date(0);
                const dateB = b.data ? new Date(b.data.anno, (b.data.mese - 1) || 0, b.data.giorno || 1) : new Date(0);
                return orderValue === "desc" ? dateB - dateA : dateA - dateB;
            });

            const grid = document.getElementById('projectGrid');
            grid.innerHTML = "";

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="loader">Nessun progetto trovato con i parametri correnti.</div>';
                return;
            }

            filtered.forEach(p => grid.appendChild(createCardElement(p, false)));
        }

        function resetAllFiltersAndCalibrations() {
            selectedAnswers = [];
            document.getElementById('searchInput').value = "";
            document.getElementById('dateOrder').value = "desc";
            syncTagsUI();
            filterAndRenderArchive();
        }

        function createCardElement(p, isHorizontal = false) {
            const title = p.titolo || "Progetto";
            const description = p.descrizione || "Nessuna descrizione.";
            const author = p.autore || "NASA Designer";
            
            let dateStr = "2028";
            if (p.data && p.data.anno) {
                dateStr = `${p.data.giorno || ''}/${p.data.mese || ''}/${p.data.anno}`;
            }

            let tagsHTML = "";
            if (p.tags && Array.isArray(p.tags)) {
                tagsHTML = p.tags.slice(0, 4).map(t => `<span class="tag mono">${t}</span>`).join('');
            }
            
            let imgUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80";
            if (p.immagine && Array.isArray(p.immagine) && p.immagine.length > 0) {
                const firstImg = p.immagine[0];
                imgUrl = firstImg.startsWith('http') ? firstImg : `https://ixd-supsi.github.io/n70api/immagini/${firstImg}`;
            }

            const card = document.createElement('div');
            card.className = `project-card ${isHorizontal ? 'horizontal-card' : ''}`;
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${imgUrl}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="card-body">
                    <div class="card-header-row">
                        <h3 class="card-title">${title}</h3>
                        <span class="card-date mono">${dateStr}</span>
                    </div>
                    <p class="card-author">${author}</p>
                    <p class="card-description">${description}</p>
                    <div class="tags-container">${tagsHTML}</div>
                    <div class="card-footer">
                        <a href="${p.url || '#'}" target="_blank" class="btn-open">Visita sito</a>
                    </div>
                </div>
            `;
            return card;
        }

        document.getElementById('searchInput').addEventListener('input', filterAndRenderArchive);
        document.getElementById('dateOrder').addEventListener('change', filterAndRenderArchive);
