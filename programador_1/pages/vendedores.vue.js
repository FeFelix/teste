var Vendedores = Vue.component('vendedores', {
    template: `
        <div class="row">
            <b-modal id="modalVendedor" ref="refModalVendedor" :title="tituloModal">
                <div class="row">
                    <div class="col-12">
                        <label>Nome</label>
                        <b-input-group label="Nome" label-for="txtNome">
                            <template #prepend>
                                <b-input-group-text >{{id}}</b-input-group-text>
                            </template>
                            <b-form-input id="txtNome" v-model="nome"  maxlength=20>
                            </b-form-input>
                        </b-input-group>
                        
                        <label class="mt-3">E-mail</label>
                        <b-input-group label="E-mail" label-for="txtEmail">
                            <b-form-input id="txtEmail" v-model="email"  maxlength=40>
                            </b-form-input>
                        </b-input-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="salvarVendedor()">
                        OK
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <div class="col-12 text-center">
                <h3>Vendedores</h3>
            </div>
            <div class="col-12 overflow-auto">
                <b-table id="tb-vendedores" small striped hover :items="vendedores" :fields="campos" :per-page="perPage" :current-page="currentPage">
                <template #head(btn_add)>
                    <i class="far fa-plus-square text-success is-click" @click="incluirVendedor()"></i>
                </template>
                    <template #head(btn_alterar)>
                        <i class="far fa-edit"></i>
                    </template>
                    <template #cell(btn_alterar)="data">
                        <i class="far fa-edit text-info is-click" @click="alterarVendedor(data.item)"></i>
                    </template>
                    <template #head(btn_del)>
                        <i class="far fa-trash-alt"></i>
                    </template>
                    <template #cell(btn_del)="data">
                        <i class="far fa-trash-alt text-danger is-click" @click="deletarVendedor(data.item)"></i>
                    </template>
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="tb-vendedores" align="center"></b-pagination>
            </div>
        </div>
        `,
    data(){
        return {
            perPage: Math.ceil(window.screen.height / 75),
            currentPage: 1,
            campos:[
                {key: 'btn_add', class: 'text-left'},
                {key: 'btn_alterar', class: 'text-left'},
                {key: 'btn_del', class: 'text-left'},
                {key: 'id', label: 'ID',},
                {key: 'nome', label: 'Nome',},
                {key: 'email', label: 'E-mail',},
            ],
            vendedores: [],
            totalRows: 1,
            tituloModal: '',
            id: '',
            nome: '',
            email: ''
        }
    },
    mounted(){
        this.buscaVendedores();
    },
    methods:{
        buscaVendedores(){
            this.vendedores = [];
            axios.get('http://localhost/programador_1/php/api/buscavendedores.php')
            .then(response => {
                if(response.data.retorno == "OK")
                    this.vendedores = response.data.dados;
                else
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        deletarVendedor(data){
            Swal.fire({
                title: 'Excluir Vendedor?',
                text: "Deseja excluir o vendedor?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    axios.delete('http://localhost/programador_1/php/api/deletarvendedores.php', {params:{id:data.id}})
                    .then(response => {
                        if(response.data.retorno == "OK"){
                            toastr.success("Vendedor excluído com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                            this.buscaVendedores();
                        }
                        else{
                            toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                        }
                    })
                    .catch(error => {
                        toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
                    });
                }
              })
        },
        limpaCampos(){
            this.id = ''
            this.nome = ''
            this.email = ''
        },
        incluirVendedor(){
            this.limpaCampos();
            this.tituloModal = "Incluir Vendedor";
            this.$bvModal.show('modalVendedor');
        },
        alterarVendedor(data){
            this.tituloModal = "Alterar Vendedor";
            this.id = data.id;
            this.nome = data.nome;
            this.email = data.email;
            this.$bvModal.show('modalVendedor');
        },
        salvarVendedor(){
            if(!this.nome || this.nome.trim() == ''){
                toastr.warning("Informe um nome","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            if(!this.email || !this.validarEmail(this.email)){
                toastr.warning("Informe um email válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            Swal.fire({
                title: Number(this.id) > 0 ? "Alterar" : "Incluir",
                text: Number(this.id) > 0 ? "Deseja alterar o vendedor" : "Deseja incluir novo vendedor",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if(Number(this.id)> 0)
                        this.confirmaAlterarVendedor();
                    else
                        this.confirmaIncluirVendedor();

                }
            })
        },
        validarEmail(email) 
        {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
                return true;

            return false;
        },
        confirmaAlterarVendedor(){
            axios.put('http://localhost/programador_1/php/api/alterarvendedores.php', {id:this.id, nome:this.nome, email: this.email})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Vendedor alterado com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalVendedor');
                    this.buscaVendedores();
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });
        },
        confirmaIncluirVendedor(){
            axios.post('http://localhost/programador_1/php/api/incluirvendedores.php', {nome:this.nome, email: this.email})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Vendedor incluído com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalVendedor');
                    this.buscaVendedores();
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });
        },
        cancelar(){
            this.$bvModal.hide('modalVendedor');
        }
    },
    watch:{
        vendedores(){
            this.totalRows = this.vendedores.length == 0 ? 1 : this.vendedores.length;
        }
    }
});