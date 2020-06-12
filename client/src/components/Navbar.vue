<template>
    <v-app-bar dense flat color="primary" >
        <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
        <v-toolbar-title class="white--text">{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <h1>{{title}}</h1> -->
        <!-- drop down menu in a button for navigation -->

        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn color="success" v-on="on">
                    Navigation
                </v-btn>
                    
                
            </template>
            <v-list>
                <v-list-item v-for="(navigation, index) in filtered_navigations" :key="index" @click="navigate(navigation)">
                    <v-list-item-title >{{navigation.name}}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <!-- <v-btn color="success" class="mr-2" router-link to='/Login'>FrontPage</v-btn> -->
        <v-btn color="white" @click="logout" icon v-if="isLogin">
            <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import UserService from '../components/UserService';

export default {
    name: 'Navbar',
    data() {
        return {
            navigations: [
                {name: 'Login', path: '/login'},
                {name: 'Projects', path: '/projects'},
                {name: 'Todos', path: '/todos'},
                {name: 'ProjectTodos', path: '/projectTodos'},
                {name: 'Daily', path: '/daily'}
            ]
        }
    },
    props:[
        'title',
        'canLogout'
    ],
    methods: {
        async logout() {
            // console.log('attempting to log out...');
            const res = await UserService.logout();
            if (res.data) {
                console.log('server session destroyed');
                this.$store.commit('users/setUserID', null);
                console.log('vuex reset to null');
                this.$router.push('/').catch((err) => {
                    console.log(`Error found as ${err}`);
                });
            } else {
                console.log('something is wrong');
            }
        },
        navigate(navigation) {
            this.$router.push(navigation.path);
        }
    },
    computed:{
        isLogin() {
            return this.$store.getters['users/getUserID'] ? true : false;
        },
        filtered_navigations() {
            return this.navigations.filter((navigation) => {
                if (navigation.name.toUpperCase() !== this.title.toUpperCase()) {
                    return true;
                }
            });
        }
    }
}
</script>

<style>

</style>