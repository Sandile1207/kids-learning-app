// Sample video data
const videos = [
    {
        id: 1,
        title: "Counting Numbers 1-10",
        description: "Learn to count with fun animations!",
        thumbnail: "assets/videeoimages/numbers.png", // Replace with actual thumbnail path
        category: "math",
        videoUrl: "https://www.youtube.com/embed/DR-cfDsHCGA"
    },
    {
        id: 2,
        title: "Animal Sounds",
        description: "Discover what sounds different animals make",
        thumbnail: "assets/videeoimages/sound.png", // Replace with actual thumbnail path
        category: "animals",
        videoUrl: "https://www.youtube.com/embed/3JA7VgAMXi0"
    },
    {
        id: 3,
        title: "The Solar System",
        description: "Explore planets in our solar system",
        thumbnail: "assets/videeoimages/solar system.png", // Replace with actual thumbnail path
        category: "space",
        videoUrl: "https://www.youtube.com/embed/libKVRa01L8"
    },
    {
        id: 4,
        title: "Basic Addition",
        description: "Learn how to add numbers",
        thumbnail: "assets/videeoimages/basic addition.png", // Replace with actual thumbnail path
        category: "math",
        videoUrl: "https://www.youtube.com/embed/AuX7nPBqDts"
    },
    {
        id: 5,
        title: "Water Cycle",
        description: "Discover how water moves around our planet",
        thumbnail: "assets/videeoimages/water cycle (1).png", // Replace with actual thumbnail path
        category: "science",
        videoUrl: "https://www.youtube.com/embed/ncORPosDrjI"
    },
    {
        id: 6,
        title: "ABC Song",
        description: "Learn the alphabet with this catchy song",
        thumbnail: "assets/videeoimages/ABC SONG.png", // Replace with actual thumbnail path
        category: "language",
        videoUrl: "https://www.youtube.com/embed/75p-N9YKqNo"
    },
    {
        id: 7,
        title: "Ocean Animals",
        description: "Explore animals that live in the ocean",
        thumbnail: "assets/videeoimages/ocean anamil.png", // Replace with actual thumbnail path
        category: "animals",
        videoUrl: "https://www.youtube.com/embed/JOJkvhSpBiQ"
    },
    {
        id: 8,
        title: "Shapes for Kids",
        description: "Learn about different shapes",
        thumbnail: "assets/videeoimages/shape for kids.png", // Replace with actual thumbnail path
        category: "math",
        videoUrl: "https://www.youtube.com/embed/OEbRDtCAFdU"
    }
];

// Function to display videos based on category
function displayVideos(category = 'all') {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = '';
    
    const filteredVideos = category === 'all' 
        ? videos 
        : videos.filter(video => video.category === category);
    
    filteredVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.setAttribute('data-video-url', video.videoUrl);
        videoCard.onclick = function() { playVideo(video.videoUrl); };
        
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" width="100%" height="100%">
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-description">${video.description}</div>
            </div>
        `;
        
        videoContainer.appendChild(videoCard);
    });
}

// Function to play a video
function playVideo(videoUrl) {
    const videoIframe = document.getElementById('videoIframe');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    
    videoIframe.src = videoUrl;
    videoPlayerModal.style.display = 'flex';
}

// Function to close the video player
function closeVideoPlayer() {
    const videoIframe = document.getElementById('videoIframe');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    
    videoIframe.src = '';
    videoPlayerModal.style.display = 'none';
}

// Set up category filter buttons
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Display videos for selected category
        displayVideos(this.getAttribute('data-category'));
    });
});

// Initialize with all videos
displayVideos();

// Close modal when clicking outside the content
window.onclick = function(event) {
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    if (event.target === videoPlayerModal) {
        closeVideoPlayer();
    }
};