<template>
    <v-container fluid>
      <portal to="settings">
          {{settings}}
      </portal>
 
        <h1>PID's </h1>
        <span>{{settings$}}</span>
        <v-btn color="success" @click="$db.save$('pids', { name: 'keith'})">Save</v-btn>
        <v-btn color="error" @click="$db.clearAll()">Clear Data</v-btn>
        <v-btn color="error" @click="$db.getDbCount()">Db Count</v-btn>
        <router-view></router-view>
    </v-container>
</template>

<script>

export default {
  data() {
      return {
        settings: {
            one: "ONe"
        }
      }
  },  
  subscriptions() {
    return {
      settings$: this.$db.getViewSettings$('pids'),
    }
  }
}
</script>

<style scoped>

</style>