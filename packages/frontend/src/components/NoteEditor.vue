<template>
    <QuillEditor :options="options" />
</template>

<script lang="ts">

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    components: {
        QuillEditor
    },
    data() {
        return {
            options: {
                placeholder: 'Start collaborating :tada:',
                theme: 'snow'
            }
        }
    },
}
</script>
