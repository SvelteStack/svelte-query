const path = require("path")
const { emitDts } = require("svelte2tsx")

main()

async function main() {
    await emitDts({
        libRoot: path.join(__dirname, "..", "src"),
        declarationDir: path.join(__dirname, "..", "dist"),
        svelteShimsPath: require.resolve("svelte2tsx/svelte-shims.d.ts")
    })
}
