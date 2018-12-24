<template>
    <div>
        <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <template v-if="derLoaded"></template>
            <v-text-field label="Select Image" @click='pickFile' v-model='derFileName'
                          prepend-icon='attach_file'></v-text-field>
            <input
                    type="file"
                    style="display: none"
                    ref="walletFile"
                    accept="*"
                    @change="onFilePicked"
            >
        </v-flex>
        <template v-if="derLoaded">
  	<v-alert success>Keys sucessfully loaded !</v-alert>
            <slot name="derLoadedActions" :privateKey="privateKey" :publicKey="publicKey" :address="address">

            </slot>
        </template>
    </div>
</template>

<script>
export default {
  name: 'ImportDer',
  data () {
    return {
      derFileName: '',
      publicKey: '',
      privateKey: '',
      address: '',
      derLoaded: false
    }
  },
  methods: {
    pickFile () {
      this.$refs.walletFile.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.derFileName = files[0].name
        if (this.derFileName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.addEventListener('load', () => {
          const derFileContents = atob(fr.result.split(',')[1])
          if (!derFileContents.length) { return }
          const { PrivateKey, PublicKey, Address } = JSON.parse(derFileContents)
          this.publicKey = PublicKey
          this.privateKey = PrivateKey
          this.address = Address
          this.derLoaded = true
        })
        fr.readAsDataURL(files[0])
      } else {
        this.derFileName = ''
        this.privateKey = ''
        this.publicKey = ''
      }
    }
  }
}

</script>

<style scoped>

</style>
