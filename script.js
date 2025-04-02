document.addEventListener('DOMContentLoaded', () => {
    const basket = document.getElementById('basket');
    const scoreboard = document.getElementById('scoreboard');
    const gameOver = document.getElementById('gameOver');
    const restartButton = document.getElementById('restartButton');
    let score = 0;
    let isGameOver = false;
    let ballSpeed = 5;

    function updateScore() {
        scoreboard.textContent = `Score: ${score}`;
    }

    function spawnBall() {
        if (isGameOver) return;
        const ball = document.createElement('div');
        ball.className = 'ball';
        const rand = Math.random();
        if (rand < 0.2) ball.classList.add('fake-ball');
        else if (rand < 0.3) ball.classList.add('bonus-ball');
        else ball.classList.add('real-ball');

        ball.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
        ball.style.top = '-30px';
        document.querySelector('.game-container').appendChild(ball);
        
        let ballTop = -30;
        const ballInterval = setInterval(() => {
            if (isGameOver) {
                clearInterval(ballInterval);
                ball.remove();
                return;
            }
            ballTop += ballSpeed;
            ball.style.top = `${ballTop}px`;

            if (checkCollision(basket, ball)) {
                clearInterval(ballInterval);
                if (ball.classList.contains('fake-ball')) score = Math.max(0, score - 2);
                else if (ball.classList.contains('bonus-ball')) score += 3;
                else score++;
                updateScore();
                ball.remove();
                ballSpeed += 0.2;
            } else if (ballTop >= window.innerHeight) {
                clearInterval(ballInterval);
                endGame();
                ball.remove();
            }
        }, 16);
    }

    function checkCollision(basket, ball) {
        const basketRect = basket.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();
        return !(basketRect.bottom < ballRect.top || 
                 basketRect.top > ballRect.bottom || 
                 basketRect.right < ballRect.left || 
                 basketRect.left > ballRect.right);
    }

    function endGame() {
        isGameOver = true;
        document.getElementById('finalScore').textContent = `Score: ${score}`;
        gameOver.style.display = 'block';
    }

    function restartGame() {
        isGameOver = false;
        score = 0;
        ballSpeed = 5;
        updateScore();
        document.querySelectorAll('.ball').forEach(el => el.remove());
        gameOver.style.display = 'none';
    }

    document.addEventListener('mousemove', (event) => {
        let newLeft = event.clientX - basket.offsetWidth / 2;
        newLeft = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, newLeft));
        basket.style.left = `${newLeft}px`;
    });

    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        let newLeft = touch.clientX - basket.offsetWidth / 2;
        newLeft = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, newLeft));
        basket.style.left = `${newLeft}px`;
    }, { passive: true });

    restartButton.addEventListener('click', restartGame);
    setInterval(spawnBall, 800);
});
