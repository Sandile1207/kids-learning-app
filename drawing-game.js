// Drawing Game JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const wordDisplay = document.getElementById('wordToDrawDisplay');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    const brushSizeInput = document.getElementById('brushSize');
    const colorBtns = document.querySelectorAll('.color-btn');
    const savedDrawingsContainer = document.getElementById('savedDrawings');
    
    // Drawing state variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#000000';
    let currentBrushSize = 5;
    let hasDrawnOnCanvas = false;
    
    // Word list for drawing prompts with reference images and key features
    const wordsToDraw = [
        { 
            word: 'ball', 
            keyFeatures: ['round', 'circular'],
            referenceImage: 'ball.png',
            complexity: 1
        },
        { 
            word: 'cat', 
            keyFeatures: ['ears', 'whiskers', 'tail'],
            referenceImage: 'cat.png',
            complexity: 2
        },
        { 
            word: 'dog', 
            keyFeatures: ['ears', 'snout', 'tail'],
            referenceImage: 'dog.png',
            complexity: 2
        },
        { 
            word: 'house', 
            keyFeatures: ['square/rectangle', 'roof', 'door', 'windows'],
            referenceImage: 'house.png',
            complexity: 2
        },
        { 
            word: 'tree', 
            keyFeatures: ['trunk', 'branches', 'leaves/crown'],
            referenceImage: 'tree.png',
            complexity: 2
        },
        { 
            word: 'sun', 
            keyFeatures: ['round', 'rays'],
            referenceImage: 'sun.png',
            complexity: 1
        },
        { 
            word: 'flower', 
            keyFeatures: ['petals', 'stem'],
            referenceImage: 'flower.png',
            complexity: 2
        },
        { 
            word: 'car', 
            keyFeatures: ['body', 'wheels', 'windows'],
            referenceImage: 'car.png',
            complexity: 3
        },
        { 
            word: 'boat', 
            keyFeatures: ['hull', 'sail/deck'],
            referenceImage: 'boat.png',
            complexity: 2
        },
        { 
            word: 'fish', 
            keyFeatures: ['body', 'tail', 'fins'],
            referenceImage: 'fish.png',
            complexity: 2
        },
        { 
            word: 'bird', 
            keyFeatures: ['body', 'wings', 'beak'],
            referenceImage: 'bird.png',
            complexity: 2
        },
        { 
            word: 'star', 
            keyFeatures: ['points', 'symmetry'],
            referenceImage: 'star.png',
            complexity: 1
        },
        { 
            word: 'apple', 
            keyFeatures: ['round', 'stem', 'possibly leaf'],
            referenceImage: 'apple.png',
            complexity: 1
        },
        { 
            word: 'banana', 
            keyFeatures: ['curved', 'yellow'],
            referenceImage: 'banana.png',
            complexity: 1
        },
        { 
            word: 'book', 
            keyFeatures: ['rectangle', 'pages', 'cover'],
            referenceImage: 'book.png',
            complexity: 1
        },
        { 
            word: 'chair', 
            keyFeatures: ['seat', 'back', 'legs'],
            referenceImage: 'chair.png',
            complexity: 2
        },
        { 
            word: 'table', 
            keyFeatures: ['flat surface', 'legs'],
            referenceImage: 'table.png',
            complexity: 2
        },
        { 
            word: 'cup', 
            keyFeatures: ['container', 'handle', 'round opening'],
            referenceImage: 'cup.png',
            complexity: 1
        },
        { 
            word: 'moon', 
            keyFeatures: ['crescent', 'round/partial circle'],
            referenceImage: 'moon.png',
            complexity: 1
        },
        { 
            word: 'cloud', 
            keyFeatures: ['puffy', 'rounded edges'],
            referenceImage: 'cloud.png',
            complexity: 1
        },
        { 
            word: 'butterfly', 
            keyFeatures: ['wings', 'symmetry', 'body', 'antennae'],
            referenceImage: 'butterfly.png',
            complexity: 3
        },
        { 
            word: 'snake', 
            keyFeatures: ['s-curve', 'head'],
            referenceImage: 'snake.png',
            complexity: 1
        },
        { 
            word: 'airplane', 
            keyFeatures: ['wings', 'body', 'tail'],
            referenceImage: 'airplane.png',
            complexity: 3
        },
        { 
            word: 'ice cream', 
            keyFeatures: ['cone', 'scoop'],
            referenceImage: 'ice-cream.png',
            complexity: 2
        },
        { 
            word: 'hat', 
            keyFeatures: ['top', 'brim'],
            referenceImage: 'hat.png',
            complexity: 1
        }
    ];
    let currentWordIndex = 0;
    
    // Initialize word display
    wordDisplay.textContent = wordsToDraw[currentWordIndex].word;
    
    // Drawing event handlers
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        // Prevent scrolling on touch devices
        e.preventDefault();
        
        const [currentX, currentY] = getCoordinates(e);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // Update last position
        [lastX, lastY] = [currentX, currentY];
        
        // Mark that something has been drawn
        hasDrawnOnCanvas = true;
        
        // Hide any previous feedback when user starts drawing again
        const feedbackEl = document.getElementById('drawingFeedback');
        if (feedbackEl) {
            feedbackEl.style.opacity = '0';
            setTimeout(() => {
                feedbackEl.remove();
            }, 300);
        }
    }
    
    // Helper to get coordinates for both mouse and touch events
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        if (e.type.includes('touch')) {
            return [
                (e.touches[0].clientX - rect.left) * scaleX,
                (e.touches[0].clientY - rect.top) * scaleY
            ];
        }
        
        return [
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        ];
    }
    
    // Clear canvas and reset drawing state
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawnOnCanvas = false;
    }
    
    // Check if drawing is sufficiently complete
    function checkDrawingValidity() {
        if (!hasDrawnOnCanvas) {
            return {
                isValid: false,
                message: "You haven't drawn anything yet!"
            };
        }
        
        // Get pixel data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let nonEmptyPixels = 0;
        
        // Count non-empty pixels
        for (let i = 0; i < imageData.length; i += 4) {
            // If pixel has any color or opacity
            if (imageData[i+3] > 0) {
                nonEmptyPixels++;
            }
        }
        
        // Calculate percentage of canvas used
        const totalPixels = canvas.width * canvas.height;
        const usedPercentage = (nonEmptyPixels / totalPixels) * 100;
        
        const currentWord = wordsToDraw[currentWordIndex];
        
        // Minimal validity check based on canvas usage and complexity
        if (usedPercentage < 1) {
            return {
                isValid: false,
                message: "Your drawing is too small. Try drawing bigger!"
            };
        } else if (usedPercentage < 3 && currentWord.complexity > 1) {
            return {
                isValid: false,
                message: `That doesn't look much like a ${currentWord.word}. Try adding more details!`
            };
        } else {
            // Analysis of drawing patterns could be more sophisticated
            // For now we're just checking if they've drawn enough
            return {
                isValid: true,
                message: `Great job! That looks like a ${currentWord.word}!`,
                hints: currentWord.keyFeatures.join(', ')
            };
        }
    }
    
    // Save drawing
    function saveDrawing() {
        // First check if the drawing is valid
        const validityCheck = checkDrawingValidity();
        
        if (!validityCheck.isValid) {
            showFeedback(validityCheck.message, false);
            return;
        }
        
        try {
            const dataURL = canvas.toDataURL('image/png');
            const currentWord = wordsToDraw[currentWordIndex].word;
            
            // Create drawing thumbnail
            const drawingElement = document.createElement('div');
            drawingElement.className = 'saved-drawing';
            
            const img = document.createElement('img');
            img.src = dataURL;
            img.alt = currentWord;
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'drawing-info';
            
            // Include validation result
            const validationSpan = document.createElement('span');
            validationSpan.className = 'validation-result correct';
            validationSpan.textContent = '✓ Correct';
            
            infoDiv.textContent = currentWord + ' ';
            infoDiv.appendChild(validationSpan);
            
            // Append everything in correct order
            drawingElement.appendChild(img);
            drawingElement.appendChild(infoDiv);
            
            // Make sure savedDrawingsContainer exists
            if (savedDrawingsContainer) {
                savedDrawingsContainer.appendChild(drawingElement);
                
                // Optional: Save to localStorage
                saveToLocalStorage(currentWord, dataURL, true);
                
                // Show success message
                showFeedback(validityCheck.message, true);
            } else {
                console.error("Container for saved drawings not found!");
                alert("Error saving drawing: container not found");
            }
        } catch (error) {
            console.error("Error saving drawing:", error);
            alert("There was an error saving your drawing.");
        }
    }
    
    // Show feedback to user
    function showFeedback(message, isCorrect) {
        try {
            // Create or get feedback element
            let feedbackEl = document.getElementById('drawingFeedback');
            if (!feedbackEl) {
                feedbackEl = document.createElement('div');
                feedbackEl.id = 'drawingFeedback';
                const canvasArea = document.querySelector('.canvas-area');
                if (canvasArea) {
                    canvasArea.appendChild(feedbackEl);
                } else {
                    document.body.appendChild(feedbackEl); // Fallback
                }
            }
            
            // Set appropriate class and message
            feedbackEl.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
            feedbackEl.textContent = message;
            
            // Add hints if drawing was incorrect and word index is valid
            if (!isCorrect && currentWordIndex >= 0 && currentWordIndex < wordsToDraw.length) {
                const hintEl = document.createElement('div');
                hintEl.className = 'hint';
                hintEl.textContent = `Hint: A ${wordsToDraw[currentWordIndex].word} has ${wordsToDraw[currentWordIndex].keyFeatures.join(', ')}.`;
                feedbackEl.appendChild(hintEl);
            }
            
            // Animate feedback
            feedbackEl.style.animation = 'none';
            setTimeout(() => {
                feedbackEl.style.animation = 'pop-in 0.5s forwards';
            }, 10);
            
            // Hide feedback after delay if correct
            if (isCorrect) {
                setTimeout(() => {
                    feedbackEl.style.opacity = '0';
                    setTimeout(() => {
                        feedbackEl.remove();
                    }, 500);
                }, 3000);
            }
        } catch (error) {
            console.error("Error showing feedback:", error);
        }
    }
    
    // Save drawing to localStorage
    function saveToLocalStorage(word, dataURL, isCorrect) {
        try {
            // Get existing drawings or initialize new array
            const savedDrawings = JSON.parse(localStorage.getItem('drawings') || '[]');
            
            // Add new drawing
            savedDrawings.push({
                word: word,
                imageData: dataURL,
                date: new Date().toISOString(),
                isCorrect: isCorrect
            });
            
            // Save back to localStorage
            localStorage.setItem('drawings', JSON.stringify(savedDrawings));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }
    
    // Load drawings from localStorage
    function loadSavedDrawings() {
        try {
            const savedDrawings = JSON.parse(localStorage.getItem('drawings') || '[]');
            
            savedDrawings.forEach(drawing => {
                try {
                    const drawingElement = document.createElement('div');
                    drawingElement.className = 'saved-drawing';
                    
                    const img = document.createElement('img');
                    img.src = drawing.imageData;
                    img.alt = drawing.word;
                    
                    const infoDiv = document.createElement('div');
                    infoDiv.className = 'drawing-info';
                    
                    // Check if we have validity information
                    if (drawing.hasOwnProperty('isCorrect')) {
                        const validationSpan = document.createElement('span');
                        validationSpan.className = drawing.isCorrect ? 
                            'validation-result correct' : 
                            'validation-result incorrect';
                        validationSpan.textContent = drawing.isCorrect ? '✓ Correct' : '✗ Try Again';
                        
                        infoDiv.textContent = drawing.word + ' ';
                        infoDiv.appendChild(validationSpan);
                    } else {
                        infoDiv.textContent = drawing.word;
                    }
                    
                    drawingElement.appendChild(img);
                    drawingElement.appendChild(infoDiv);
                    savedDrawingsContainer.appendChild(drawingElement);
                } catch (itemError) {
                    console.error("Error loading a saved drawing:", itemError);
                }
            });
        } catch (error) {
            console.error("Error loading saved drawings:", error);
        }
    }
    
    // Initialize with the first word's reference
    setTimeout(updateReferenceImage, 100);
    
    // Change to next word
    function nextWord() {
        currentWordIndex = (currentWordIndex + 1) % wordsToDraw.length;
        wordDisplay.textContent = wordsToDraw[currentWordIndex].word;
        wordDisplay.classList.remove('word-animate');
        
        // Update reference image if available
        updateReferenceImage();
        
        // Trigger animation
        setTimeout(() => {
            wordDisplay.classList.add('word-animate');
        }, 10);
        
        // Clear canvas for new word
        clearCanvas();
        hasDrawnOnCanvas = false;
        
        // Remove any feedback
        const feedbackEl = document.getElementById('drawingFeedback');
        if (feedbackEl) {
            feedbackEl.remove();
        }
    }
    
    // Show reference image if available
    function updateReferenceImage() {
        try {
            // Check if reference container exists
            let refContainer = document.getElementById('referenceContainer');
            if (!refContainer) {
                // Create reference container
                refContainer = document.createElement('div');
                refContainer.id = 'referenceContainer';
                refContainer.className = 'reference-container';
                
                // Add reference image
                const refImage = document.createElement('img');
                refImage.id = 'referenceImage';
                refImage.className = 'reference-image';
                
                // Add toggle button
                const toggleBtn = document.createElement('button');
                toggleBtn.textContent = 'Show Example';
                toggleBtn.className = 'toggle-reference-btn';
                toggleBtn.onclick = toggleReferenceImage;
                
                refContainer.appendChild(refImage);
                refContainer.appendChild(toggleBtn);
                
                // Add to page
                const drawingHeader = document.querySelector('.drawing-header');
                if (drawingHeader) {
                    drawingHeader.appendChild(refContainer);
                }
            }
            
            // Update reference image source
            const refImage = document.getElementById('referenceImage');
            if (refImage) {
                const currentWord = wordsToDraw[currentWordIndex];
                
                // If using actual images:
                // refImage.src = 'images/' + currentWord.referenceImage;
                
                // For demo, use a placeholder instead
                refImage.style.display = 'none';
                refImage.src = `/api/placeholder/200/200?text=${currentWord.word}`;
                refImage.alt = currentWord.word;
            }
        } catch (error) {
            console.error("Error updating reference image:", error);
        }
    }
    
    // Toggle reference image visibility
    function toggleReferenceImage() {
        try {
            const refImage = document.getElementById('referenceImage');
            const toggleBtn = document.querySelector('.toggle-reference-btn');
            
            if (refImage && toggleBtn) {
                if (refImage.style.display === 'none') {
                    refImage.style.display = 'block';
                    toggleBtn.textContent = 'Hide Example';
                } else {
                    refImage.style.display = 'none';
                    toggleBtn.textContent = 'Show Example';
                }
            }
        } catch (error) {
            console.error("Error toggling reference image:", error);
        }
    }
    
    // Set up event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
    
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Button handlers
    clearBtn.addEventListener('click', clearCanvas);
    saveBtn.addEventListener('click', saveDrawing);
    nextWordBtn.addEventListener('click', nextWord);
    
    // Brush size handler
    brushSizeInput.addEventListener('input', function() {
        currentBrushSize = this.value;
    });
    
    // Color selection
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all buttons
            colorBtns.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Update current color
            currentColor = this.getAttribute('data-color');
        });
    });
    
    // Initialize saved drawings from localStorage
    loadSavedDrawings();
    
    // Add custom word functionality - can be expanded
    function addCustomWord(word) {
        if (word && !wordsToDraw.some(item => item.word === word)) {
            wordsToDraw.push({
                word: word,
                keyFeatures: ['custom word'],
                referenceImage: null,
                complexity: 1
            });
            return true;
        }
        return false;
    }
    
    // Optional: Add ability for teachers/parents to add custom words
    window.addDrawingWord = function(word) {
        if (addCustomWord(word)) {
            alert(`Added "${word}" to the drawing words!`);
        } else {
            alert(`"${word}" is already in the list or invalid!`);
        }
    };
});