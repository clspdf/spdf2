<template>
    <v-container fluid class="grey lighten-5">
        <Navbar :title="this.$options.name.toUpperCase()"></Navbar>
        <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <h1>{{selectedProject}}</h1>
        
        <!-- normal new/edit todo session -->

        <v-dialog max-width="500px" v-model="dialog">
            <template v-slot:activator="{ on }">
                <v-btn color="primary white--text" v-on="on" class="my-3 ml-5" >
                    Add New
                </v-btn>                
                                 
            </template>
            <v-card>
                <v-overlay :value="overlay">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <v-card-title>{{formTitle}}</v-card-title>
                <v-card-text>
                    <v-switch v-model="selectProject" :label="`Project?`" @change="populateProjects"></v-switch>
                    <v-overflow-btn :items="projectTitles" v-model="selectedIndex" :disabled="!selectProject" v-if="changeProject"></v-overflow-btn>
                    <v-text-field v-else readonly :placeholder="originalProjectTitle"></v-text-field>
                    <v-text-field v-model="editedTodo.title" label="Title"></v-text-field>
                    
                    <v-textarea auto-grow v-model="editedTodo.content" label="Content"></v-textarea>
                    <v-text-field v-model="editedTodo.status" label="Status"></v-text-field>
                    <!-- <v-text-field v-model="editedTodo.due" label="Due By"></v-text-field> -->
                    <v-menu v-model="due_menu" :close-on-content-click="false" transition="scale-transition" min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="editedTodo.due" label="Pick a due date" prepend-inner-icon="mdi-calendar" readonly v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="editedTodo.due" no-title scrollable @input="due_menu = false">
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

        <!-- todos display session -->


        <v-card class="mx-5 my-1" v-for="projectTodo in projectTodos" :key="projectTodo._id">
            <v-row no-gutters>
                <v-col cols="12" md="6">
                    <div>
                        <v-card flat class="pl-3 font-weight-bold headline d-flex align-end justify-right" height="30">
                            {{projectTodo.title}}
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="pl-3 pa-1 font-weight-regular">
                            {{projectTodo.content}}
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
                            {{projectTodo.due}}
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
                            {{projectTodo.created}}
                        </v-card>
                    </div>
                </v-col>
                <v-col cols="4" md="2">
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-chip color="primary" small>{{projectTodo.status}}</v-chip>
                            
                        </v-card>
                    </div>
                    <div>
                        <v-card flat class="d-flex justify-end align-end pr-3" height="30">
                            <v-btn icon color="primary" @click="editProjectTodo(projectTodo)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            
                            
                            <v-btn icon color="warning" @click="deleteProjectTodo(projectTodo)">
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
    name: 'ProjectTodos',
    components: {
        Navbar
    },
    data() {
        return {
            projectTodos: [],
            projects:[],
            loading: false,
            overlay: false,
            dialog: false,
            due_menu: false,
            editedIndex: -1,
            selectProject: false,
            originalProjectTitle: '',
            oldProjectID: '',
            editedTodo: {
                project_id: '',
                title: '',
                content: '',

                due: '',
                status: '',
                
            },
            blankTodo: {
                project_id: '',
                title: '',
                content: '',

                due: '',
                status: '',            
            },
            selectedIndex:'',
        }
    },
    methods: {
        close() {
            
            this.editedTodo = Object.assign({}, this.blankTodo);
            this.editedIndex = -1;
            this.oldProjectID = '',
            this.selectProject = false;
            this.selectedIndex = '';
            this.dialog = false;

        },
        async save(){
            this.loading = true;
            if (this.editedIndex === -1) { // create projectTodo
                
                if (this.selectProject) {
                    this.editedTodo.project_id = this.selectedProject._id;
                } else {
                    this.editedTodo.project_id = '';
                }
                await ProjectService.createProjectTodo(this.editedTodo);
                this.projectTodos = (await ProjectService.getAllProjectTodos()).data;
                this.close();
                this.loading = false;
            } else { // edit projectTodo
                if (this.changeProject) { // edit project id, this needs to change order for editedTodo, and those in the old projects
                    // await ProjectService.updateProjectTodo(this.editedTodo);
                    // console.log(`old project id: ${this.editedTodo.project_id}, new project id: ${this.selectedProject._id}`);
                    this.oldProjectID = this.editedTodo.project_id;
                    this.editedTodo.project_id = this.selectedProject._id;
                    await ProjectService.switchTodoProject(this.editedTodo, this.oldProjectID );
                    // console.log(this.changeProject);
                } else { // do not edit project id
                    await ProjectService.updateProjectTodo(this.editedTodo);
                }
                
                
                this.projectTodos = (await ProjectService.getAllProjectTodos()).data;
                this.close();
                this.loading = false;
            }
        },
        async populateProjects() {
            if (this.selectProject) {
                this.overlay = true;
                this.projects = (await ProjectService.getProjects()).data;
                this.overlay = false;
            } else {
                this.selectedProject = {};

            }
        },
        async editProjectTodo(projectTodo) {
            this.editedIndex = 1;
            this.editedTodo = Object.assign({}, projectTodo);
            
            console.log(this.editedTodo);
            if (this.editedTodo.project_id) {
                this.overlay = true;
                this.originalProjectTitle = (await ProjectService.getOneProject(this.editedTodo.project_id)).data[0].title;
                this.overlay = false;
            }
            this.dialog = true;
        },
        async deleteProjectTodo(projectTodo){
            console.log('deleting');
            this.overlay = true;
            await ProjectService.deleteProjectTodo(projectTodo);
            this.projectTodos = (await ProjectService.getAllProjectTodos()).data;
            
            this.overlay = false;
        }
    },
    computed: {
        formTitle() {
            if (this.editedIndex === -1) {
                return 'New TODO';
            } else {
                return 'Edit TODO';
            }
        },
        projectTitles() {
            if (this.projects) {
                return this.projects.map((project, index) => `${index}.${project.title}`);
            }
        },
        selectedProject() {
            if (this.selectedIndex) {
                const index = Number(this.selectedIndex.split('.')[0]);
                return this.projects[index];
            } else {
                return null;
            }
        },
        changeProject() {
            if ((this.editedIndex === 1) && (!this.selectProject)) {
                return false;
            } else {
                return true;
            }
        }
    },
    async created() {
        this.projectTodos = (await ProjectService.getAllProjectTodos()).data;
    }
}
</script>

<style>

</style>