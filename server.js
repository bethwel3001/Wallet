const express = require('express');
const ethers = require('ethers');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Ethereum testnet (Goerli)
const provider = new ethers.providers.InfuraProvider('goerli', 'YOUR_INFURA_PROJECT_ID'); // Replace with your Infura project ID

// Generate a new wallet
app.post('/create-wallet', (req, res) => {
    const wallet = ethers.Wallet.createRandom();
    res.json({
        address: wallet.address,
        privateKey: wallet.privateKey,
    });
});

// Get wallet balance
app.get('/balance/:address', async (req, res) => {
    const balance = await provider.getBalance(req.params.address);
    res.json({
        balance: ethers.utils.formatEther(balance),
    });
});

// Send transaction
app.post('/send', async (req, res) => {
    const { senderPrivateKey, recipientAddress, amount } = req.body;

    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amount),
    });

    res.json({
        transactionHash: tx.hash,
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});