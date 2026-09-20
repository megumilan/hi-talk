import { globalIgnores } from 'eslint/config'
import { fileURLToPath } from 'node:url'
import {
    defineConfigWithVueTs,
    vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{vue,ts,mts,tsx}'],
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

    ...pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,

    {
        name: 'app/typescript-parser',
        files: ['**/*.{vue,ts,mts,tsx}'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: projectRoot,
            },
        },
    },

    ...pluginOxlint.buildFromOxlintConfigFile(
        fileURLToPath(new URL('.oxlintrc.json', import.meta.url))
    )
)
