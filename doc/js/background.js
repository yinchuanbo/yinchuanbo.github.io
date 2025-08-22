document.addEventListener('DOMContentLoaded', function() {
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'interactive-background';
  document.body.insertBefore(canvas, document.body.firstChild);
  
  // Set canvas to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Get canvas context
  const ctx = canvas.getContext('2d');
  
  // Particle settings
  const particleCount = 120; // Increased particle count
  const particles = [];
  const connectionDistance = 180; // Increased connection distance
  const mouseRadius = 150; // Increased mouse interaction radius
  
  // Special particles (data nodes)
  const dataNodes = [];
  const dataNodeCount = 5;
  
  // Mouse position
  let mouseX = 0;
  let mouseY = 0;
  let mouseActive = false;
  let pulseEffect = 0;
  
  // Track mouse position and activity
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseActive = true;
    
    // Create pulse effect on mouse move
    pulseEffect = 1;
    
    // Reset mouse active after some time of inactivity
    clearTimeout(window.mouseTimeout);
    window.mouseTimeout = setTimeout(() => {
      mouseActive = false;
    }, 2000);
  });
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.baseSize = this.size;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.2})`; // Purple color with varying opacity
      this.glowing = Math.random() > 0.9; // Some particles will glow
      this.glowIntensity = 0;
      this.glowDirection = 1;
      this.dataConnections = []; // Store connections to data nodes
    }
    
    update() {
      // Move particles
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off edges
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
      
      // Mouse interaction with pulse effect
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseRadius && mouseActive) {
        const angle = Math.atan2(dy, dx);
        const force = (mouseRadius - distance) / mouseRadius;
        this.speedX -= Math.cos(angle) * force * 0.8;
        this.speedY -= Math.sin(angle) * force * 0.8;
        
        // Increase size briefly when affected by mouse
        this.size = this.baseSize * (1 + force * 0.5);
      } else {
        // Return to base size
        this.size = this.baseSize;
      }
      
      // Pulse effect from mouse movement
      if (pulseEffect > 0 && distance < mouseRadius * 2) {
        this.size += pulseEffect * 0.5 * (1 - distance / (mouseRadius * 2));
      }
      
      // Glow effect for special particles
      if (this.glowing) {
        this.glowIntensity += 0.02 * this.glowDirection;
        if (this.glowIntensity > 1 || this.glowIntensity < 0) {
          this.glowDirection *= -1;
        }
      }
      
      // Limit speed
      this.speedX = Math.max(-2.5, Math.min(2.5, this.speedX));
      this.speedY = Math.max(-2.5, Math.min(2.5, this.speedY));
      
      // Find connections to data nodes
      this.dataConnections = [];
      for (let i = 0; i < dataNodes.length; i++) {
        const dx = dataNodes[i].x - this.x;
        const dy = dataNodes[i].y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance * 1.5) {
          this.dataConnections.push({
            node: dataNodes[i],
            distance: distance
          });
        }
      }
    }
    
    draw() {
      // Draw particle
      if (this.glowing) {
        // Draw glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 4
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.5 * this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw connections to data nodes
      for (let i = 0; i < this.dataConnections.length; i++) {
        const connection = this.dataConnections[i];
        const opacity = 0.15 * (1 - connection.distance / (connectionDistance * 1.5));
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]); // Dashed line for data connections
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(connection.node.x, connection.node.y);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line style
      }
    }
  }
  
  // Data Node class (special larger particles that act as hubs)
  class DataNode {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 4 + 6; // Larger size
      this.pulseSize = 0;
      this.pulseDirection = 1;
      this.rotation = 0;
      this.rotationSpeed = Math.random() * 0.02 - 0.01;
      this.color = `rgba(139, 92, 246, 0.8)`;
    }
    
    update() {
      // Pulse effect
      this.pulseSize += 0.03 * this.pulseDirection;
      if (this.pulseSize > 1 || this.pulseSize < 0) {
        this.pulseDirection *= -1;
      }
      
      // Rotate
      this.rotation += this.rotationSpeed;
    }
    
    draw() {
      // Draw glow
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, `rgba(139, 92, 246, 0.3)`);
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw node
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + this.pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw tech pattern
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      // Hexagonal pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        const x = Math.cos(angle) * (this.size - 1);
        const y = Math.sin(angle) * (this.size - 1);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
      
      // Center dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  // Create particles and data nodes
  function init() {
    // Create data nodes first
    for (let i = 0; i < dataNodeCount; i++) {
      dataNodes.push(new DataNode());
    }
    
    // Create regular particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Draw connections between particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          // Calculate data flow effect
          const flowOffset = (Date.now() % 2000) / 2000; // 0 to 1 over 2 seconds
          
          // Draw connection with data flow effect
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / connectionDistance)})`;
          ctx.lineWidth = 0.5;
          
          // Use gradient for high-tech look
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(139, 92, 246, ${0.05 * (1 - distance / connectionDistance)})`);
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.2 * (1 - distance / connectionDistance)})`);
          gradient.addColorStop(1, `rgba(139, 92, 246, ${0.05 * (1 - distance / connectionDistance)})`);
          
          ctx.strokeStyle = gradient;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          
          // Add data flow dots on some connections
          if (Math.random() > 0.7) {
            const flowPosition = (flowOffset + Math.random() * 0.2) % 1;
            const dotX = particles[i].x + (particles[j].x - particles[i].x) * flowPosition;
            const dotY = particles[i].y + (particles[j].y - particles[i].y) * flowPosition;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }
  
  // Draw grid pattern in background
  function drawGrid() {
    const gridSize = 30;
    const gridOpacity = 0.05;
    
    ctx.strokeStyle = `rgba(139, 92, 246, ${gridOpacity})`;
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  
  // Draw mouse interaction effects
  function drawMouseEffects() {
    if (!mouseActive) return;
    
    // Draw pulse ring
    if (pulseEffect > 0) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(139, 92, 246, ${pulseEffect * 0.3})`;
      ctx.lineWidth = 2;
      ctx.arc(mouseX, mouseY, mouseRadius * pulseEffect, 0, Math.PI * 2);
      ctx.stroke();
      
      // Decrease pulse effect
      pulseEffect -= 0.02;
      if (pulseEffect < 0) pulseEffect = 0;
    }
    
    // Draw targeting reticle
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1;
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Cross lines
    ctx.beginPath();
    ctx.moveTo(mouseX - 25, mouseY);
    ctx.lineTo(mouseX + 25, mouseY);
    ctx.moveTo(mouseX, mouseY - 25);
    ctx.lineTo(mouseX, mouseY + 25);
    ctx.stroke();
  }
  
  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Update and draw data nodes
    for (let i = 0; i < dataNodes.length; i++) {
      dataNodes[i].update();
      dataNodes[i].draw();
    }
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // Draw connections
    drawConnections();
    
    // Draw mouse effects
    drawMouseEffects();
    
    // Request next frame
    requestAnimationFrame(animate);
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize particles and data nodes
    particles.length = 0;
    dataNodes.length = 0;
    init();
  });
  
  // Add click effect
  document.addEventListener('click', function(e) {
    // Create ripple effect
    pulseEffect = 1.5;
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseActive = true;
    
    // Reset mouse active after some time
    clearTimeout(window.mouseTimeout);
    window.mouseTimeout = setTimeout(() => {
      mouseActive = false;
    }, 2000);
  });
  
  // Add digital numbers that occasionally appear
  setInterval(() => {
    if (Math.random() > 0.7 && mouseActive) {
      // Create a floating binary number
      const binaryDiv = document.createElement('div');
      binaryDiv.className = 'binary-code';
      binaryDiv.style.position = 'absolute';
      binaryDiv.style.left = `${Math.random() * window.innerWidth}px`;
      binaryDiv.style.top = `${Math.random() * window.innerHeight}px`;
      binaryDiv.style.color = 'rgba(139, 92, 246, 0.4)';
      binaryDiv.style.fontSize = `${Math.random() * 12 + 8}px`;
      binaryDiv.style.fontFamily = 'monospace';
      binaryDiv.style.pointerEvents = 'none';
      binaryDiv.style.zIndex = '-1';
      binaryDiv.style.opacity = '0';
      binaryDiv.style.transform = 'translateY(20px)';
      binaryDiv.style.transition = 'all 2s ease-out';
      
      // Generate random binary string
      let binary = '';
      for (let i = 0; i < 8; i++) {
        binary += Math.round(Math.random());
      }
      binaryDiv.textContent = binary;
      
      // Add to body
      document.body.appendChild(binaryDiv);
      
      // Animate
      setTimeout(() => {
        binaryDiv.style.opacity = '1';
        binaryDiv.style.transform = 'translateY(0)';
      }, 10);
      
      // Remove after animation
      setTimeout(() => {
        binaryDiv.style.opacity = '0';
        binaryDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          document.body.removeChild(binaryDiv);
        }, 2000);
      }, 2000);
    }
  }, 500);
  
  // Initialize and start animation
  init();
  animate();
});

// Add CSS for high-tech elements
const style = document.createElement('style');
style.textContent = `
  .binary-code {
    position: absolute;
    pointer-events: none;
    user-select: none;
    text-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
  }
`;
document.head.appendChild(style);
