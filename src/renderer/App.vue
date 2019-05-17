<template>
  <v-app id="sandbox" :dark="dark">
    <v-navigation-drawer
      v-model="secondaryDrawer.model"
      :permanent="secondaryDrawer.type === 'permanent'"
      :temporary="secondaryDrawer.type === 'temporary'"
      :clipped="secondaryDrawer.clipped"
      :floating="secondaryDrawer.floating"
      :mini-variant="secondaryDrawer.mini"
      width="300"
      right
      app>

       <portal-target name="settings">
        </portal-target>


    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      width="200"
      absolute
      overflow
      app
    >
  <v-list>

    <v-list-tile :to="{path: '/'}">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Home</v-list-tile-title>
    </v-list-tile>

    <v-divider></v-divider>

    <v-list-group
      prepend-icon="domain"
      value="true"
    >
    <template v-slot:activator>
      <v-list-tile>
        <v-list-tile-title>Social</v-list-tile-title>
      </v-list-tile>
    </template>

    <v-list-tile 
      v-for="(social, i) in menu.social"
      :key="i"
       :to="social.path">

      <v-list-tile-title v-text="social.name"> </v-list-tile-title>
        <v-list-tile-action>
          <v-icon v-text="social.icon"></v-icon>
        </v-list-tile-action>
    </v-list-tile>
    </v-list-group>

      <v-divider></v-divider>

    <v-divider></v-divider>

    <v-list-group
      prepend-icon="list"
      value="true"
    >
    <template v-slot:activator>
      <v-list-tile>
        <v-list-tile-title>PID</v-list-tile-title>
      </v-list-tile>
    </template>

    <v-list-tile 
      v-for="(pid, i) in menu.pids"
      :key="i"
       :to="pid.path">

      <v-list-tile-title v-text="pid.name"> </v-list-tile-title>
        <v-list-tile-action>
          <v-icon v-text="pid.icon"></v-icon>
        </v-list-tile-action>
    </v-list-tile>
    </v-list-group>

      <v-divider></v-divider>

  </v-list>

    </v-navigation-drawer>
    <v-toolbar :clipped-left="primaryDrawer.clipped" app absolute>
      <v-toolbar-side-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      ></v-toolbar-side-icon>
      <v-toolbar-side-icon
        v-if="primaryDrawer.type === 'permanent'"
        @click.stop="primaryDrawer.mini = !primaryDrawer.mini"
      ></v-toolbar-side-icon>
      <v-toolbar-title>Vuetify</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu
        v-model="settingsMenu.menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-icon>settings</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>Application Settings</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-tile>
              <v-list-tile-action>
                <v-flex xs12 md12>
                  <span>Color Scheme</span>
                  <v-switch v-model="dark" primary label="Dark"></v-switch>
                </v-flex>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-action>
                <v-layout row wrap>
                  <v-flex xs12 md12>
                    <span>Footer</span>
                    <v-switch v-model="footer.inset" label="Inset" primary></v-switch>
                  </v-flex>
                </v-layout>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <v-layout>
            <v-flex xs12 pl-3>
              <v-radio-group v-model="primaryDrawer.type" column>
                <v-radio
                  v-for="drawer in drawers"
                  :key="drawer"
                  :label="drawer"
                  :value="drawer.toLowerCase()"
                  primary
                ></v-radio>
              </v-radio-group>
              <v-switch v-model="primaryDrawer.clipped" label="Clipped" primary></v-switch>
              <v-switch v-model="primaryDrawer.floating" label="Floating" primary></v-switch>
              <v-switch v-model="primaryDrawer.mini" label="Mini" primary></v-switch>
            </v-flex>
          </v-layout>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat @click="settingsMenu.menu = false">Close</v-btn>
            <!-- <v-btn color="primary" flat @click="settingsMenu.menu = false">Save</v-btn> -->
          </v-card-actions>
        </v-card>
      </v-menu>
        <v-btn icon
        @click.stop="secondaryDrawer.model = !secondaryDrawer.model"
      >
        <v-icon>tune</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
        <router-view></router-view>
    </v-content>
    <v-footer :inset="footer.inset" app>
      <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>

import { getRoutes } from './router'

export default {
  name: 'kmappdktp',
  data: () => ({
    dark: true,
    drawers: ['Default (no property)', 'Permanent', 'Temporary'],
    menu: getRoutes(),
    primaryDrawer: {
      model: null,
      type: 'permanent',
      clipped: false,
      floating: false,
      mini: false,
    },
    secondaryDrawer: {
      drawers: ['Default (no property)', 'Permanent', 'Temporary'],
      model: null,
      type: 'temporary',
      clipped: false,
      floating: false,
      mini: false,
    },
    settingsMenu: {
      fav: true,
      menu: false,
      message: false,
      hints: true,
    },
    footer: {
      inset: false,
    },
  }),
  methods: {
    goto(obj) {
      this.$router.push({ path: obj[0].toLowerCase() })
    }
  },
};
</script>

<style lang="scss">
/* CSS */
.v-list__group__items .v-list__tile {
    padding-left: 40px;
}
</style>
