<template>
    <v-container fluid class="grey lighten-5">
        <Navbar :title="this.$options.name.toUpperCase()"></Navbar>
        <h1>Where is my navbar</h1>

        <!-- button to add new project -->

        <v-dialog max-width="500px" v-model="dialog">
            <template v-slot:activator="{ on }">
                <v-btn color="primary white--text" v-on="on" class="my-3 ml-5" >
                    Add New
                </v-btn>                
                                 
            </template>
            <v-card>
                <v-card-title>{{formTitle}}</v-card-title>
                <v-card-text>
                    
                    <v-text-field v-model="editedProject.title" label="Title"></v-text-field>
                    
                    <v-textarea auto-grow v-model="editedProject.content" label="Content"></v-textarea>
                    <v-text-field v-model="editedProject.status" label="Status"></v-text-field>
                    <!-- <v-text-field v-model="editedTodo.due" label="Due By"></v-text-field> -->
                    <v-menu v-model="due_menu" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="editedProject.due" label="Pick a due date" prepend-inner-icon="mdi-calendar" readonly v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="editedProject.due" no-title scrollable @input="due_menu = false">
                        </v-date-picker>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="close">Cancel</v-btn>
                    <v-btn color="success" @click="save" :loading="loading">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- hereafter displays all projects -->

        <v-card class="mx-5" v-for="project in projects" :key="project._id">
            <v-row no-gutters>
                <v-col cols="12" md="6">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold headline d-flex align-end justify-right" height="30" @click="goToProjectDetail(project)">
                            {{project.title}}
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{project.content}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold grey--text d-flex align-end justify-right" height="30">
                            Due By
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{project.due}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold grey--text d-flex align-end justify-right" height="30">
                            Created On
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{project.created}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-chip color="primary" small>{{project.status}}</v-chip>
                            
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-btn icon color="primary" @click="editProject(project)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            
                            
                            <v-btn icon color="warning" @click="deleteProject(project)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-card>
                    </div>
                    
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import Navbar from '../components/Navbar';
import ProjectService from '../components/ProjectService';

export default {
    name: 'Projects',
    components: {
        Navbar
    },
    data() {
        return {
            projects: [],
            dialog: false,
            editedIndex: -1,
            editedProject: {
                projectCategory: '',
                title: '',
                content: '',
                
                due: '',
                status: '',
            },
            blankProject: {
                projectCategory: '',
                title: '',
                content: '',
                
                due: '',
                status: '',
            },
            due_menu: false,
            loading: false
        }
    },
    async created() {
        this.projects = (await ProjectService.getProjects()).data;
    },
    methods: {
        editProject(project) {
            this.editedIndex = 0;
            this.editedProject = Object.assign({}, project);
            this.dialog = true;
        },
        async deleteProject(project) {
            await ProjectService.deleteProject(project);
            this.projects = (await ProjectService.getProjects()).data;
        },
        goToProjectDetail(project) {
            this.$router.push(`/projectdetail/projectid/${project._id}/projecttitle/${project.title}`);
        },
        async save() {
            this.loading = true;
            if (this.editedIndex === -1){ // add new project
                await ProjectService.createProject(this.editedProject);
                this.projects = (await ProjectService.getProjects()).data;
                this.loading = false;
                this.close();
            } else { // edit project
                await ProjectService.updateProject(this.editedProject);
                this.projects = (await ProjectService.getProjects()).data;
                this.loading = false;
                this.close();
            }
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedProject = Object.assign({}, this.blankProject);
                this.editedIndex = -1;
            })
        },
    },
    computed: {
        formTitle() {
            if (this.editedIndex === -1) {
                return 'New Project';
            } else {
                return 'Edit Project';
            }
        }
    }

}
</script>

<style>

</style>