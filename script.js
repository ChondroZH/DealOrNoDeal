// Prize amounts in the game
const prizeAmounts = [
    1, 5, 10, 20, 30, 50, 80, 100, 200, 300
];

// Game state
let cases = [];
let playerCase = null;
let casesToOpen = [3, 2, 2, 1]; // Cases to open per round
let currentRound = 0;
let casesOpenedThisRound = 0;
let gameActive = true;
let isProcessing = false;

// Sound system
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playCaseClick() {
    playSound(800, 0.1, 'sine');
}

function playCaseReveal(value) {
    // Higher pitch for higher values
    const frequency = value > 200 ? 600 : value > 50 ? 500 : 400;
    playSound(frequency, 0.2, 'triangle');
}

function playBankerOffer() {
    // Deep, ponderable sound - creates tension and contemplation
    playSound(200, 0.4, 'sine');
    setTimeout(() => playSound(180, 0.4, 'sine'), 400);
    setTimeout(() => playSound(220, 0.5, 'sine'), 800);
    setTimeout(() => playSound(200, 0.6, 'triangle'), 1300);
}

function playDealAccepted(amount) {
    if (amount === 1000) {
        // ULTIMATE CELEBRATION for top prize offer!
        playSound(523, 0.15, 'sine'); // C
        playSound(659, 0.15, 'sine'); // E
        setTimeout(() => {
            playSound(784, 0.15, 'sine'); // G
            playSound(1047, 0.15, 'sine'); // C high
        }, 150);
        setTimeout(() => {
            playSound(659, 0.15, 'sine'); // E
            playSound(1319, 0.15, 'sine'); // E high
        }, 300);
        setTimeout(() => {
            playSound(784, 0.15, 'sine'); // G
            playSound(1568, 0.15, 'sine'); // G high
        }, 450);
        setTimeout(() => {
            playSound(1047, 0.3, 'sine'); // C
            playSound(1319, 0.3, 'sine'); // E
            playSound(1568, 0.3, 'sine'); // G
        }, 600);
        setTimeout(() => {
            playSound(1319, 0.2, 'triangle');
            playSound(1568, 0.2, 'triangle');
            playSound(2093, 0.2, 'triangle'); // C very high
        }, 900);
        setTimeout(() => {
            playSound(2093, 0.5, 'sine'); // Final high note
        }, 1100);
    } else if (amount >= 300) {
        // Epic victory fanfare for big win!
        playSound(659, 0.2, 'sine'); // E
        setTimeout(() => playSound(784, 0.2, 'sine'), 200); // G
        setTimeout(() => playSound(1047, 0.2, 'sine'), 400); // C
        setTimeout(() => playSound(1319, 0.3, 'sine'), 600); // E high
        setTimeout(() => {
            playSound(1047, 0.2, 'triangle');
            playSound(1319, 0.2, 'triangle');
        }, 900);
        setTimeout(() => playSound(1568, 0.5, 'sine'), 1100); // G very high
    } else {
        // Regular win sound
        playSound(500, 0.2, 'sine');
        setTimeout(() => playSound(600, 0.2, 'sine'), 200);
        setTimeout(() => playSound(800, 0.4, 'sine'), 400);
    }
}

function playNoDeal() {
    playSound(400, 0.15, 'square');
}

function playGameOver(amount) {
    if (amount === 1000) {
        // ULTIMATE CELEBRATION for top prize!
        playSound(523, 0.15, 'sine'); // C
        playSound(659, 0.15, 'sine'); // E
        setTimeout(() => {
            playSound(784, 0.15, 'sine'); // G
            playSound(1047, 0.15, 'sine'); // C high
        }, 150);
        setTimeout(() => {
            playSound(659, 0.15, 'sine'); // E
            playSound(1319, 0.15, 'sine'); // E high
        }, 300);
        setTimeout(() => {
            playSound(784, 0.15, 'sine'); // G
            playSound(1568, 0.15, 'sine'); // G high
        }, 450);
        setTimeout(() => {
            playSound(1047, 0.3, 'sine'); // C
            playSound(1319, 0.3, 'sine'); // E
            playSound(1568, 0.3, 'sine'); // G
        }, 600);
        setTimeout(() => {
            playSound(1319, 0.2, 'triangle');
            playSound(1568, 0.2, 'triangle');
            playSound(2093, 0.2, 'triangle'); // C very high
        }, 900);
        setTimeout(() => {
            playSound(2093, 0.5, 'sine'); // Final high note
        }, 1100);
    } else if (amount >= 300) {
        // Epic victory fanfare for big win!
        playSound(659, 0.2, 'sine'); // E
        setTimeout(() => playSound(784, 0.2, 'sine'), 200); // G
        setTimeout(() => playSound(1047, 0.2, 'sine'), 400); // C
        setTimeout(() => playSound(1319, 0.3, 'sine'), 600); // E high
        setTimeout(() => playSound(1568, 0.5, 'sine'), 900); // G high
        setTimeout(() => {
            playSound(1047, 0.2, 'triangle');
            playSound(1319, 0.2, 'triangle');
            playSound(1568, 0.2, 'triangle');
        }, 1400);
    } else {
        playSound(600, 0.2, 'sine');
        setTimeout(() => playSound(700, 0.2, 'sine'), 200);
        setTimeout(() => playSound(900, 0.5, 'sine'), 400);
    }
}

// Initialize the game
function initGame() {
    // Reset game state
    cases = [];
    playerCase = null;
    currentRound = 0;
    casesOpenedThisRound = 0;
    gameActive = true;
    isProcessing = false;
    
    // Shuffle prizes and assign to cases
    const shuffledPrizes = [...prizeAmounts].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 10; i++) {
        cases.push({
            number: i + 1,
            value: shuffledPrizes[i],
            opened: false,
            isPlayerCase: false
        });
    }
    
    // Render the game
    renderCases();
    renderPrizes();
    updateStatus('Select your case to keep!');
    
    // Hide banker offer and game over
    document.getElementById('banker-offer').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
}

// Render cases on the board
function renderCases() {
    const grid = document.getElementById('cases-grid');
    grid.innerHTML = '';
    
    cases.forEach(caseItem => {
        const caseDiv = document.createElement('div');
        caseDiv.className = 'case';
        
        if (caseItem.opened) {
            caseDiv.innerHTML = `
                <div class="case-number">${caseItem.number}</div>
                <div class="case-value">${formatMoney(caseItem.value)}</div>
            `;
            caseDiv.classList.add('opened');
            if (caseItem.isPlayerCase) {
                caseDiv.classList.add('selected');
            }
        } else if (caseItem.isPlayerCase) {
            caseDiv.innerHTML = `<div class="case-number">${caseItem.number}</div>`;
            caseDiv.classList.add('selected');
        } else {
            caseDiv.innerHTML = `<div class="case-number">${caseItem.number}</div>`;
            caseDiv.addEventListener('click', () => handleCaseClick(caseItem));
        }
        
        grid.appendChild(caseDiv);
    });
}

// Render prize board
function renderPrizes() {
    const leftPrizes = document.getElementById('left-prizes');
    const rightPrizes = document.getElementById('right-prizes');
    leftPrizes.innerHTML = '';
    rightPrizes.innerHTML = '';
    
    const halfPoint = Math.ceil(prizeAmounts.length / 2);
    
    prizeAmounts.forEach((prize, index) => {
        const prizeDiv = document.createElement('div');
        prizeDiv.className = 'prize-item';
        prizeDiv.textContent = formatMoney(prize);
        
        // Check if this prize has been eliminated
        const eliminated = cases.some(c => c.value === prize && c.opened);
        if (eliminated) {
            prizeDiv.classList.add('eliminated');
        }
        
        if (index < halfPoint) {
            leftPrizes.appendChild(prizeDiv);
        } else {
            rightPrizes.appendChild(prizeDiv);
        }
    });
}

// Handle case click
function handleCaseClick(caseItem) {
    if (!gameActive) return;
    
    // Prevent clicking when processing another case
    if (isProcessing) return;
    
    // Prevent clicking when banker offer is shown
    const bankerOffer = document.getElementById('banker-offer');
    if (!bankerOffer.classList.contains('hidden')) return;
    
    // If player hasn't selected their case yet
    if (!playerCase) {
        playerCase = caseItem;
        caseItem.isPlayerCase = true;
        playCaseClick();
        renderCases();
        updateStatus(`You chose case ${caseItem.number}! Now open ${casesToOpen[currentRound]} cases.`);
        return;
    }
    
    // Open a case
    if (!caseItem.opened && !caseItem.isPlayerCase) {
        isProcessing = true;
        caseItem.opened = true;
        casesOpenedThisRound++;
        
        playCaseClick();
        renderCases();
        renderPrizes();
        
        // Show the revealed value
        updateStatus(`Case ${caseItem.number} contained ${formatMoney(caseItem.value)}!`);
        playCaseReveal(caseItem.value);
        
        // Check if round is complete
        setTimeout(() => {
            if (casesOpenedThisRound >= casesToOpen[currentRound]) {
                casesOpenedThisRound = 0;
                currentRound++;
                
                // Check if game should end
                const remainingCases = cases.filter(c => !c.opened && !c.isPlayerCase);
                if (remainingCases.length === 0) {
                    endGame(false);
                } else {
                    showBankerOffer();
                }
            } else {
                const remaining = casesToOpen[currentRound] - casesOpenedThisRound;
                updateStatus(`Open ${remaining} more ${remaining === 1 ? 'case' : 'cases'}.`);
                isProcessing = false;
            }
        }, 600);
    }
}

// Calculate banker's offer
function calculateOffer() {
    const remainingCases = cases.filter(c => !c.opened);
    const sum = remainingCases.reduce((total, c) => total + c.value, 0);
    const average = sum / remainingCases.length;
    
    // Base multiplier - Banker offers less early in the game, more later
    let roundMultiplier = 0.45 + (currentRound * 0.12);
    
    // Risk-based adjustment - check if high values remain
    const remainingValues = remainingCases.map(c => c.value).sort((a, b) => b - a);
    const topThreeValues = [1000, 500, 300];
    const highValuesRemaining = topThreeValues.filter(val => remainingValues.includes(val)).length;
    
    // Reduce offer if high values are still in play
    if (highValuesRemaining >= 2) {
        roundMultiplier *= 0.90; // 10% reduction
    } else if (highValuesRemaining === 1) {
        roundMultiplier *= 0.95; // 5% reduction
    }
    
    // Calculate base offer
    let offer = average * roundMultiplier;
    
    // Round to nearest dollar only
    return Math.round(offer);
}

// Show banker offer
function showBankerOffer() {
    const offer = calculateOffer();
    const bankerDiv = document.getElementById('banker-offer');
    const offerAmount = document.getElementById('offer-amount');
    
    offerAmount.textContent = formatMoney(offer);
    bankerDiv.classList.remove('hidden');
    
    playBankerOffer();
    updateStatus('The banker has made an offer!');
    
    // Reset processing flag so game doesn't get stuck
    isProcessing = false;
    
    // Set up deal/no deal buttons
    document.getElementById('deal-btn').onclick = () => acceptDeal(offer);
    document.getElementById('no-deal-btn').onclick = () => rejectDeal();
}

// Accept the deal
function acceptDeal(offer) {
    gameActive = false;
    playDealAccepted(offer);
    document.getElementById('banker-offer').classList.add('hidden');
    
    // Open all remaining cases including player's case
    cases.forEach(c => {
        if (!c.opened) {
            c.opened = true;
        }
    });
    
    renderCases();
    
    // Small delay before showing game over
    setTimeout(() => {
        showGameOver(true, offer);
    }, 800);
}

// Reject the deal
function rejectDeal() {
    playNoDeal();
    document.getElementById('banker-offer').classList.add('hidden');
    isProcessing = false;
    
    const remainingCases = cases.filter(c => !c.opened && !c.isPlayerCase).length;
    if (remainingCases > 0 && currentRound < casesToOpen.length) {
        updateStatus(`Open ${casesToOpen[currentRound]} more ${casesToOpen[currentRound] === 1 ? 'case' : 'cases'}.`);
    } else {
        endGame(false);
    }
}

// End game (when all other cases are opened)
function endGame(isDeal) {
    gameActive = false;
    
    // Check if there's exactly one case remaining (final round choice)
    const remainingCases = cases.filter(c => !c.opened && !c.isPlayerCase);
    if (remainingCases.length === 1 && !isDeal) {
        // Show the final choice: keep or switch
        showFinalChoice(remainingCases[0]);
        return;
    }
    
    // Open all remaining cases
    cases.forEach(c => {
        if (!c.opened) {
            c.opened = true;
        }
    });
    
    renderCases();
    
    // Small delay before showing game over
    setTimeout(() => {
        showGameOver(isDeal, playerCase.value);
    }, 800);
}

// Show final choice (keep or switch)
function showFinalChoice(lastCase) {
    const bankerDiv = document.getElementById('banker-offer');
    
    // Modify the banker offer display for the final choice
    bankerDiv.innerHTML = `
        <h2>Final Decision</h2>
        <p style="margin-bottom: 20px;">You have Case ${playerCase.number}, and Case ${lastCase.number} remains.</p>
        <p style="margin-bottom: 30px; font-size: 1.1rem; font-weight: bold;">Do you want to keep your case or switch?</p>
        <div class="offer-buttons">
            <button id="keep-btn" class="btn btn-deal">KEEP Case ${playerCase.number}</button>
            <button id="switch-btn" class="btn btn-no-deal">SWITCH to Case ${lastCase.number}</button>
        </div>
    `;
    
    bankerDiv.classList.remove('hidden');
    updateStatus('Make your final choice!');
    
    // Set up keep/switch buttons
    document.getElementById('keep-btn').onclick = () => finalChoice(false, lastCase);
    document.getElementById('switch-btn').onclick = () => finalChoice(true, lastCase);
}

// Handle final choice
function finalChoice(didSwitch, lastCase) {
    document.getElementById('banker-offer').classList.add('hidden');
    
    let finalAmount;
    if (didSwitch) {
        // Player switched, so they get the last case value
        finalAmount = lastCase.value;
        lastCase.isPlayerCase = true;
        playerCase.isPlayerCase = false;
        playerCase = lastCase;
    } else {
        // Player kept their original case
        finalAmount = playerCase.value;
    }
    
    // Open all cases
    cases.forEach(c => {
        c.opened = true;
    });
    
    renderCases();
    
    // Small delay before showing game over
    setTimeout(() => {
        showGameOverWithChoice(didSwitch, finalAmount);
    }, 800);
}

// Show game over screen
function showGameOver(isDeal, amount) {
    const gameOverDiv = document.getElementById('game-over');
    const finalMessage = document.getElementById('final-message');
    const finalAmount = document.getElementById('final-amount');
    const caseReveal = document.getElementById('case-reveal');
    const caseAmount = document.getElementById('case-amount');
    
    if (isDeal) {
        finalMessage.textContent = 'You took the deal!';
        // Show what was actually in the case
        caseReveal.classList.remove('hidden');
        caseAmount.textContent = formatMoney(playerCase.value);
    } else {
        finalMessage.textContent = `Your case contained:`;
        caseReveal.classList.add('hidden');
    }
    
    finalAmount.textContent = formatMoney(amount);
    gameOverDiv.classList.remove('hidden');
    
    // Play victory sound if won 300 or more
    if (!isDeal && amount >= 300) {
        playGameOver(amount);
    }
}

// Show game over screen with choice info
function showGameOverWithChoice(didSwitch, amount) {
    const gameOverDiv = document.getElementById('game-over');
    const finalMessage = document.getElementById('final-message');
    const finalAmount = document.getElementById('final-amount');
    const caseReveal = document.getElementById('case-reveal');
    
    if (didSwitch) {
        finalMessage.textContent = `You switched and won:`;
    } else {
        finalMessage.textContent = `You kept your case and won:`;
    }
    
    finalAmount.textContent = formatMoney(amount);
    caseReveal.classList.add('hidden');
    gameOverDiv.classList.remove('hidden');
    
    // Play victory sound if won 300 or more
    if (amount >= 300) {
        playGameOver(amount);
    }
}

// Update status message
function updateStatus(message) {
    document.getElementById('status-text').textContent = message;
}

// Format money display
function formatMoney(amount) {
    if (amount < 1) {
        return `$${amount.toFixed(2)}`;
    }
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// Restart button
document.getElementById('restart-btn').addEventListener('click', initGame);

// ========== TEMPORARY TEST CODE - REMOVE LATER ==========
// Test button to simulate winning top prize
// document.getElementById('test-win-btn').addEventListener('click', function() {
//     // Set player case to have top prize
//     if (!playerCase) {
//         playerCase = cases[0];
//         playerCase.isPlayerCase = true;
//     }
//     playerCase.value = 1000;
    
//     // Open all other cases
//     cases.forEach(c => {
//         if (!c.isPlayerCase) {
//             c.opened = true;
//         }
//     });
    
//     // Trigger game end
//     endGame(false);
// });
// ========== END TEST CODE ==========

// Start the game
initGame();
