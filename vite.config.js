export default {
    root: 'src/',
    base:'/SolarSystem/',
    build: {
        outDir: '../dist', // Output directory for the built files
        rollupOptions: {
            output: {
                entryFileNames: 'bundle.js', // Name of the final JS bundle
            },
        },
    },
}