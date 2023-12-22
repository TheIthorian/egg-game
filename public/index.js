import '../dist/main.js';

window.addEventListener('load', async () => {
    console.log('Window loaded');
    await App.newInstance(document.getElementById('app-root')).main();
});
