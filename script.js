/**
 * Hệ thống quản lý nội dung Bình Hưng và AI
 * Phát triển bởi AI Assistant
 */

let allData = [];

// Khởi chạy khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setupEventListeners();
});

// Hàm lấy dữ liệu từ file JSON
async function fetchData() {
    const grid = document.getElementById('contentGrid');
    
    try {
        // Trạng thái chờ
        grid.innerHTML = `<p class="col-span-full text-center text-gray-500 animate-pulse py-20">Đang đồng bộ dữ liệu từ kho lưu trữ...</p>`;
        
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Cổng dữ liệu bị ngắt kết nối');
        
        allData = await response.json();
        renderItems(allData);
        
    } catch (error) {
        console.error("Lỗi:", error);
        grid.innerHTML = `
            <div class="col-span-full text-center p-12 border border-red-900/20 bg-red-900/5 rounded-3xl">
                <i class="fa-solid fa-triangle-exclamation text-[#ff4444] text-3xl mb-4"></i>
                <h2 class="text-xl font-bold text-red-400">Lỗi truy cập dữ liệu</h2>
                <p class="text-gray-500 mt-2 text-sm">Bạn cần chạy trang web này trên môi trường Server (GitHub Pages, Live Server) để hệ thống hoạt động.</p>
            </div>
        `;
    }
}

// Hàm render các Card nội dung
function renderItems(items) {
    const grid = document.getElementById('contentGrid');
    const noResult = document.getElementById('noResult');
    grid.innerHTML = '';

    if (items.length === 0) {
        noResult.classList.remove('hidden');
        return;
    }

    noResult.classList.add('hidden');
    items.forEach((item, index) => {
        const card = document.createElement('div');
        // Thêm animation delay để card hiện lần lượt
        card.className = 'glass-card rounded-3xl p-7 flex flex-col justify-between animate-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-6">
                    <span class="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 bg-[#00ff99]/10 rounded-full text-[#00ff99] border border-[#00ff99]/20 font-bold">
                        ${item.category}
                    </span>
                    <button onclick="copyToClipboard('${item.link}')" title="Copy liên kết" class="text-gray-600 hover:text-[#00ff99] transition-colors">
                        <i class="fa-regular fa-clone"></i>
                    </button>
                </div>
                <h3 class="text-xl font-bold mb-3 tracking-tight leading-snug">${item.title}</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 font-light">${item.desc}</p>
            </div>
            
            <div>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${item.tags.map(tag => `<span class="text-[11px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">#${tag}</span>`).join('')}
                </div>

                <a href="${item.link || '#'}" target="_blank" 
                   class="inline-block w-full py-3 text-center rounded-2xl bg-white/5 border border-white/10 hover:border-[#00ff99] hover:bg-[#00ff99] hover:text-black transition-all duration-500 font-bold text-xs tracking-widest uppercase shadow-lg shadow-black">
                    Truy cập tài nguyên
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Cài đặt các bộ lắng nghe sự kiện
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Xử lý tìm kiếm
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query) ||
            item.tags.some(t => t.toLowerCase().includes(query))
        );
        renderItems(filtered);
    });

    // Xử lý lọc danh mục
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cập nhật giao diện nút
            filterBtns.forEach(b => {
                b.classList.remove('neon-text', 'border-[#00ff99]/40');
                b.style.borderColor = 'rgba(255,255,255,0.08)';
            });
            btn.classList.add('neon-text', 'border-[#00ff99]/40');
            btn.style.borderColor = 'rgba(0,255,153,0.4)';

            const cat = btn.getAttribute('data-cat');
            const filtered = cat === 'all' ? allData : allData.filter(i => i.category === cat);
            renderItems(filtered);
        });
    });
}

// Tiện ích sao chép
function copyToClipboard(text) {
    if(!text || text === '#') return;
    navigator.clipboard.writeText(text).then(() => {
        alert('Đã lưu liên kết vào bộ nhớ tạm!');
    });
}
