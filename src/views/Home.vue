<template>
  <div class="home">
    <Mapa/>
    <footer class="copy">
			<p class="float-right"><a href="#">Regresar arriba</a></p>
			<p>&copy; 2017-2020 TRITIUM, S.p.A. &middot; <a href="https://tritium.cl/privacy.html#spanish">Política de privacidad</a> &middot; <a
				 href="https://tritium.cl/disclaimer.html#spanish">Términos y condiciones</a></p>
			<p>Desarrollado por TRITIUM, S.p.A.</p>
		</footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Mapa from '@/components/Mapa.vue'

export default {
  name: 'Home',
  components: {
    Mapa
  }
}
</script>

<style scoped>
.copy {
  font-size: x-small;
}
</style>