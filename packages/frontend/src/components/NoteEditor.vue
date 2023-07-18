<template>
    <QuillEditor @textChange="handleChange" :options="options" />
</template>

<script setup lang="ts">

import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const options = {
    placeholder: 'Start collaborating! :tada:',
    theme: 'snow'
}

function handleChange(change: {
    delta: any,
    oldContents: any,
    source: any
}) {
    console.log(change.delta);
}
</script>
