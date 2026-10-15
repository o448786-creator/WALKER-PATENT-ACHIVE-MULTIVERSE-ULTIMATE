// Banco de Dados Inicial Padrão
const patentesIniciais = [
    { codigo: "WK-2015", nome: "Walker Drone v1", descricao: "UAVs táticos de reconhecimento aéreo guiados por frequências sintéticas de áudio.", inventor: "Aviation Walker Corp", data_registro: "2015.12.03", status: "OPERATIONAL" },
    { codigo: "WK-BLUE", nome: "The Blue Redux", descricao: "Filtros de isolamento sonoro para arenas cibernéticas e amplificação de graves puros.", inventor: "Walker SoundLabs", data_registro: "2023.04.14", status: "OPERATIONAL" },
    { codigo: "WK-4181", nome: "Spectre Camouflage", descricao: "Tecnologia furtiva avançada de camuflagem térmica e visual para operações urbanas.", inventor: "Aviation Walker Industries", data_registro: "2021.09.14", status: "OPERATIONAL" },
    { codigo: "WK-0000", nome: "Ghost Protocol", descricao: "Protocolo digital de ocultação de IP e pacotes na rede mesh global.", inventor: "The Resistance Coding Division", data_registro: "2018.11.30", status: "OPERATIONAL" },
    { codigo: "WK-1997", nome: "Ghost Rider System", descricao: "Pós-combustão cibernética aplicada a motocicletas stealth com blindagem reativa.", inventor: "Brimstone Propulsion Lab", data_registro: "2023.05.12", status: "CLASSIFIED" },
    { codigo: "MV-MARK85", nome: "Nano Stark Armor", descricao: "Estrutura nano-molecular regenerativa capaz de materializar escudos e armas em milissegundos.", inventor: "Stark Industries", data_registro: "2019.04.26", status: "CLASSIFIED" },
    { codigo: "MV-PYM02", nome: "Partículas Pym", descricao: "Fórmula molecular capaz de alterar a distância interatômica, reduzindo ou aumentando matéria.", inventor: "Pym Technologies", data_registro: "1963.11.10", status: "CLASSIFIED" },
    { codigo: "SP-928", nome: "Gis-Laser Web", descricao: "Fluido de teia sintético reforçado com polímeros eletrônicos estáveis para contenção dimensional.", inventor: "Miguel O'Hara (Spider-Man 2099)", data_registro: "2099.08.11", status: "OPERATIONAL" },
    { codigo: "SP-42", nome: "Goober Dimensional", descricao: "Dispositivo portátil de sincronização quântica capaz de colapsar e abrir portais estáveis no Multiverso.", inventor: "Alchemax Laboratories", data_registro: "2018.12.14", status: "CLASSIFIED" }
];

// Carrega os dados ou mantém os padrões
let patentes = JSON.parse(localStorage.getItem('walker_multiverse_ultimate_db')) || patentesIniciais;
let filtroAtivoUniverso = 'ALL';

// Mapeamento de Elementos do DOM
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const noResults = document.getElementById('noResults');
const patentForm = document.getElementById('patentForm');
const btnExport = document.getElementById('btnExport');
const btnImportFake = document.getElementById('btnImportFake');
const importFile = document.getElementById('importFile');
const filterTags = document.getElementById('filterTags');

// Função Principal para Exibir Patentes
function exibirPatentes() {
    resultsContainer.innerHTML = '';
    const termo = searchInput.value.toLowerCase().trim();

    const filtradas = patentes.filter(p => {
        const combinaTermo = p.nome.toLowerCase().includes(termo) || 
                             p.codigo.toLowerCase().includes(termo) ||
                             p.inventor.toLowerCase().includes(termo) ||
                             p.status.toLowerCase().includes(termo);
        
        const combinaUniverso = (filtroAtivoUniverso === 'ALL') || p.codigo.toUpperCase().startsWith(filtroAtivoUniverso);
        
        return combinaTermo && combinaUniverso;
    });

    if (filtradas.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';
    
    filtradas.forEach((patente, index) => {
        const card = document.createElement('div');
        card.className = 'patent-card';
        // Delay escalonado dinâmico para os itens entrarem em efeito cascata
        card.style.animationDelay = `${index * 0.05}s`;
        
        const statusClass = `status-${patente.status.toLowerCase()}`;
        
        card.innerHTML = `
            <div class="patent-header">
                <span class="patent-title">${patente.nome}</span>
                <span class="patent-code">[ ${patente.codigo} ]</span>
            </div>
            <p class="patent-desc">${patente.descricao}</p>
            <div class="patent-meta">
                <div class="meta-item">Inventor: <span>${patente.inventor}</span></div>
                <div class="meta-item">Data Reg: <span>${patente.data_registro}</span></div>
                <div class="meta-item">Status: <span class="status-badge ${statusClass}">${patente.status}</span></div>
                <button class="btn-delete" data-code="${patente.codigo}">❌ Deletar</button>
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    // Vincula eventos nos novos botões deletar gerados
     VincularEventosDeletar();
}

// Vincula a ação de exclusão
function VincularEventosDeletar() {
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = function() {
            const codigo = this.getAttribute('data-code');
            if(confirm(`Confirmar remoção permanente do registro técnico: [ ${codigo} ]?`)) {
                patentes = patentes.filter(p => p.codigo !== codigo);
                salvarDatabase();
                exibirPatentes();
            }
        };
    });
}

// Salva as alterações na memória física do navegador
function salvarDatabase() {
    localStorage.setItem('walker_multiverse_ultimate_db', JSON.stringify(patentes));
}

// Escuta a caixa de pesquisa
searchInput.addEventListener('input', exibirPatentes);

// Controle dos botões de categorias
filterTags.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-btn')) {
        filtroAtivoUniverso = e.target.getAttribute('data-prefix');
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        exibirPatentes();
    }
});

// Manipulador do Formulário de Registro
patentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const hoje = new Date();
    const dataFormatada = `${hoje.getFullYear()}.${String(hoje.getMonth() + 1).padStart(2, '0')}.${String(hoje.getDate()).padStart(2, '0')}`;

    const novaPatente = {
        codigo: document.getElementById('newCode').value.trim(),
        nome: document.getElementById('newName').value.trim(),
        descricao: document.getElementById('newDesc').value.trim(),
        inventor: document.getElementById('newInventor').value.trim(),
        data_registro: dataFormatada,
        status: document.getElementById('newStatus').value
    };

    patentes.unshift(novaPatente); 
    salvarDatabase();
    patentForm.reset();
    exibirPatentes(); 
});

// Rotina de exportação (.json)
btnExport.onclick = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patentes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "walker_multiverse_database.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
};

// Rotina de importação (.json)
btnImportFake.onclick = () => importFile.click();
importFile.onchange = function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importadas = JSON.parse(e.target.result);
            if (Array.isArray(importadas)) {
                patentes = importadas;
                salvarDatabase();
                exibirPatentes();
                alert("Base de dados sincronizada com sucesso!");
            } else {
                alert("Erro: Formato inválido de JSON.");
            }
        } catch (err) {
            alert("Falha crítica ao ler os dados do arquivo.");
        }
    };
    reader.readAsText(file);
};

// Start Inicial da Aplicação
exibirPatentes();
