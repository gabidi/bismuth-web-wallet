<template>
    <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
        <template v-if="derLoaded"></template>
        <v-text-field label="Select Image" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
        <input
                type="file"
                style="display: none"
                ref="walletFile"
                accept="*"
                @change="onFilePicked"
        >
    </v-flex>
</template>

<script>
export default {
  name: 'ImportDer',
  data () {
    return {
      imageName: '',
      imageUrl: '',
      imageFile: '',
      derLoaded: false
    }
  },
  methods: {
    pickFile () {
      this.$refs.walletFile.click()
    }

  },
  onFilePicked (e) {
    const files = e.target.files
    if (files[0] !== undefined) {
      this.imageName = files[0].name
      if (this.imageName.lastIndexOf('.') <= 0) {
        return
      }
      const fr = new FileReader()
      fr.readAsDataURL(files[0])
      fr.addEventListener('load', () => {
        this.imageUrl = fr.result
        this.imageFile = files[0] // this is an image file that can be sent to server...
      })
    } else {
      this.imageName = ''
      this.imageFile = ''
      this.imageUrl = ''
    }
  }
}

</script>

<style scoped>

</style>
