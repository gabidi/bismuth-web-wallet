<template>
    <v-card>
        <v-layout row wrap>
            <v-flex xs12 v-if="derLoaded">
                <v-alert
                        v-model="derLoaded"
                        type="success"
                        transition="scale-transition"
                        color="success">Keys sucessfully loaded ! Click on "Add to address book" to add address
                </v-alert>
            </v-flex>
            <v-flex xs12 v-if="invalidDerFile">
                <v-alert transition="scale-transition"
                         type="error"
                         v-model="invalidDerFile"
                         color="error">Invalid der file provided. Please select another file.
                </v-alert>
            </v-flex>
            <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
                <template v-if="derLoaded"></template>
                <v-text-field label="Click here to Select Der File" @click='pickFile' v-model='derFileName'
                              prepend-icon='attach_file'></v-text-field>
                <input
                        type="file"
                        style="display: none"
                        ref="walletFile"
                        accept="*"
                        @change="onFilePicked"
                >
            </v-flex>
        </v-layout>
        <v-card-actions v-if="derLoaded">
            <slot name="derLoadedActions" :privateKey="privateKey" :publicKey="publicKey" :address="address">
            </slot>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
  name: 'ImportDer',
  props: ['resetToggle'],
  data () {
    return {
      derFileName: '',
      publicKey: '',
      privateKey: '',
      address: '',
      derLoaded: false,
      invalidDerFile: false
    }
  },
  watch: {
    resetToggle () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  },
  methods: {
    pickFile () {
      this.$refs.walletFile.click()
    },
    onFilePicked (e) {
      this.invalidDerFile = false
      const files = e.target.files
      if (files[0] !== undefined) {
        this.derFileName = files[0].name
        if (this.derFileName.lastIndexOf('.') <= 0) {
          this.invalidDerFile = true
          return
        }
        const fr = new FileReader()
        fr.addEventListener('load', () => {
          const derFileContents = atob(fr.result.split(',')[1])
          if (!derFileContents.length) {
            this.invalidDerFile = true
            return
          }

          try {
            // const fields = { privateKey: ['Private Key', 'PrivateKey'], publicKey: ['Public Key', 'PublicKey'] }
            const derFile = JSON.parse(derFileContents)

            // @Todo discuss python naming convention for json.
            const { Address } = derFile
            const PrivateKey = derFile['Private Key'] || derFile['PrivateKey']
            const PublicKey = derFile['Public Key'] || derFile['PublicKey']

            if (!PrivateKey || !PublicKey || !Address) {
              this.invalidDerFile = true
              return
            }
            this.publicKey = PublicKey
            this.privateKey = PrivateKey
            this.address = Address
            this.derLoaded = true
          } catch (err) {
            this.invalidDerFile = true
          }
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
