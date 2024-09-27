export default {
    root: 'src/',
    build: {
        outDir: '../dist', // Output directory for the built files
        rollupOptions: {
            output: {
                entryFileNames: 'bundle.js', // Name of the final JS bundle
            },
        },
    },
}