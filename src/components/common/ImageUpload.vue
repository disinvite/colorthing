<template>
  <div>
    <button v-on:click="$refs['uploader'].click()">Upload image</button>
    <input type="file" ref="uploader" style="display:none" v-on:change="upload">
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  methods: {
    upload(evt) {
      const files = evt.target.files || evt.dataTransfer.files;
      if (!files.length) { return; }

      const reader = new FileReader();
      reader.onload = e => this.$emit('upload', e.target.result)

      reader.readAsDataURL(files[0]);
      evt.target.value = '';
    }
  }
}
</script>

<style scoped>
</style>
