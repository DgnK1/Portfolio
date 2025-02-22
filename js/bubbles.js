// Initialize bubble animation system
document.addEventListener("DOMContentLoaded", function () {
    const BUBBLE_SIZE = 400; // Size of each bubble element
    const MIN_DISTANCE = 200; // Minimum distance before collision
    const SPEED_FACTOR = 0.5; // Movement speed multiplier

    const bubbles = document.querySelectorAll(".post");
    const container = document.querySelector(".post-wrapper");
    let bubbleData = [];

    /**
     * Generates random position and velocity for a bubble
     * @returns {Object} Initial position and velocity values
     */
    function getRandomPosition() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        return {
            x: Math.random() * (containerWidth - BUBBLE_SIZE),
            y: Math.random() * (containerHeight - BUBBLE_SIZE),
            vx: (Math.random() - 0.5) * SPEED_FACTOR,
            vy: (Math.random() - 0.5) * SPEED_FACTOR,
            isDragging: false
        };
    }


    /**
     * Initializes bubble positions and sets up event listeners
     */
    function initializeBubbles() {
        bubbles.forEach((bubble, index) => {
            const position = getRandomPosition();
            bubbleData.push({ element: bubble, ...position });
            setupDragEvents(bubble, index);
        });
    }

    /**
     * Sets up drag event listeners for a bubble
     * @param {HTMLElement} bubble - The bubble element
     * @param {number} index - Index of the bubble in bubbleData array
     */
    function setupDragEvents(bubble, index) {
        bubble.addEventListener("mousedown", (event) => startDrag(event, index));
        document.addEventListener("mouseup", stopDrag);
        document.addEventListener("mousemove", drag);
    }


    let draggedBubble = null;
    let offsetX = 0, offsetY = 0;

    function startDrag(event, index) {
        draggedBubble = bubbleData[index];
        draggedBubble.isDragging = true;

        // Get mouse position relative to the bubble
        offsetX = event.clientX - draggedBubble.x;
        offsetY = event.clientY - draggedBubble.y;
    }

    function stopDrag() {
        if (draggedBubble) {
            draggedBubble.isDragging = false;
            draggedBubble = null;
        }
    }

    function drag(event) {
        if (draggedBubble && draggedBubble.isDragging) {
            let containerRect = container.getBoundingClientRect();
            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;

            // Keep within container boundaries
            newX = Math.max(0, Math.min(containerRect.width - 300, newX));
            newY = Math.max(0, Math.min(containerRect.height - 300, newY));

            draggedBubble.x = newX;
            draggedBubble.y = newY;
        }
    }

    /**
     * Updates bubble positions and handles collisions
     */
    function updatePositions() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        moveBubbles(containerWidth, containerHeight);
        handleCollisions();
        applyPositions();
        requestAnimationFrame(updatePositions);
    }

    /**
     * Moves bubbles that aren't being dragged
     * @param {number} containerWidth - Width of the container
     * @param {number} containerHeight - Height of the container
     */
    function moveBubbles(containerWidth, containerHeight) {
        bubbleData.forEach(bubble => {
            if (!bubble.isDragging) {
                bubble.x += bubble.vx;
                bubble.y += bubble.vy;
                handleWallCollision(bubble, containerWidth, containerHeight);
            }
        });
    }

    /**
     * Handles collision with container walls
     * @param {Object} bubble - Bubble data object
     * @param {number} containerWidth - Width of the container
     * @param {number} containerHeight - Height of the container
     */
    function handleWallCollision(bubble, containerWidth, containerHeight) {
        if (bubble.x <= 0 || bubble.x >= containerWidth - BUBBLE_SIZE) {
            bubble.vx *= -1;
        }
        if (bubble.y <= 0 || bubble.y >= containerHeight - BUBBLE_SIZE) {
            bubble.vy *= -1;
        }
    }

    /**
     * Handles collisions between bubbles
     */
    function handleCollisions() {
        for (let i = 0; i < bubbleData.length; i++) {
            for (let j = i + 1; j < bubbleData.length; j++) {
                const b1 = bubbleData[i];
                const b2 = bubbleData[j];
                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MIN_DISTANCE) {
                    handleBubbleCollision(b1, b2, dx, dy, distance);
                }
            }
        }
    }

    /**
     * Handles collision between two bubbles
     * @param {Object} b1 - First bubble data
     * @param {Object} b2 - Second bubble data
     * @param {number} dx - X distance between bubbles
     * @param {number} dy - Y distance between bubbles
     * @param {number} distance - Distance between bubble centers
     */
    function handleBubbleCollision(b1, b2, dx, dy, distance) {
        // Swap velocities
        [b1.vx, b2.vx] = [b2.vx, b1.vx];
        [b1.vy, b2.vy] = [b2.vy, b1.vy];

        // Push bubbles apart to prevent overlap
        const overlap = MIN_DISTANCE - distance;
        const pushX = (dx / distance) * (overlap / 2);
        const pushY = (dy / distance) * (overlap / 2);
        
        b1.x -= pushX;
        b1.y -= pushY;
        b2.x += pushX;
        b2.y += pushY;
    }

    /**
     * Applies calculated positions to bubble elements
     */
    function applyPositions() {
        bubbleData.forEach(bubble => {
            bubble.element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
        });
    }

    // Initialize the bubble system
    initializeBubbles();


    requestAnimationFrame(updatePositions);
});
