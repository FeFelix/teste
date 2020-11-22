var Vendas = Vue.component('Vendas', {
    template: `
        <div class="row">
            <b-modal id="modalVendas" ref="refModalVendas" :title="tituloModal">
                <div class="row">
                    <div class="col-12">
                        <label>Vendedor</label>
                        <b-input-group label="Nome" label-for="cmbVendedores">
                            <b-form-select id="cmbVendedores" v-model="vendedor" :options="listaVendedores"></b-form-select>
                            </b-form-input>
                        </b-input-group>
                        
                        <label class="mt-3">Valor</label>
                        <b-input-group label="E-mail" label-for="txtValor">
                            <b-form-input ref="txtValor" v-currency="{currency: 'BRL', locale: 'pt-BR'}" id="txtValor" v-model="valor">
                            </b-form-input>
                        </b-input-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="inclusaoVendas()">
                        OK
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <b-modal id="ModalPesquisaVendas" ref="refModalPesquisaVendas" title="Pesquisar Vendas">
                <div class="row">
                    <div class="col-12">
                        <label>Vendedor</label>
                        <b-input-group label="NomePesquisa" label-for="cmbVendedores">
                            <b-form-select id="cmbVendedoresPesquisa" v-model="vendedorPesquisa" :options="listaVendedores"></b-form-select>
                            </b-form-input>
                        </b-input-group>
                        
                        <label class="mt-3">Valor</label>
                        <b-input-group label="ValorPesquisa" label-for="txtValorPesquisa">
                            <b-form-input ref="txtValorPesquisa" v-currency="{currency: 'BRL', locale: 'pt-BR'}" id="txtValorPesquisa" v-model="valorPesquisa">
                            </b-form-input>
                        </b-input-group>

                        <b-form-group label="Situação">
                            <b-form-radio-group id="radioGroupSituacao" v-model="situacaoPesquisa" name="radioGroupSituacao">
                                <b-form-radio value="">Todas</b-form-radio>
                                <b-form-radio value="0">Ativas</b-form-radio>
                                <b-form-radio value="1">Canceladas</b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="De">
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="dataPesquisaInicio" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Até">
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="dataPesquisaFim" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="pesquisarVendas()">
                        Pesquisar
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <b-modal id="modalRelatorioVendas" ref="modalRelatorioVendas" title="Reltório do dia">
                <div class="row">
                    <div class="col-12">
                    <label class="mt-3">E-mail (Para)</label>
                        <b-input-group label="E-mail Para" label-for="txtEmailPara">
                            <b-form-input id="txtEmailPara" v-model="emailPara">
                            </b-form-input>
                        </b-input-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="enviarRelatorio()">
                        Enviar
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <div class="col-6 offset-3 text-center">
                <h3> Vendas</h3>
            </div><div class="col-3 text-right">
            <b-button size="sm" variant="success" @click="PerquisarVendas()">
                Pesquisar
            </b-button>
            </div>
            <div class="col-12 overflow-auto">
                <b-table id="tb-vendas" small striped hover :items="vendas" :fields="campos" :per-page="perPage" :current-page="currentPage">
                <template #head(btn_add)>
                    <i class="far fa-plus-square text-success is-click" @click="incluirVendas()"></i>
                </template>
                    <template #head(btn_cancelar)>
                        <i class="fas fa-ban"></i>
                    </template>
                    <template #cell(btn_cancelar)="data">
                        <i  class="fas fa-ban text-danger is-click" @click="cancelarVendas(data.item)"></i>
                    </template>
                    <template #table-caption>
                        <div class="row">
                            <div class="col-8">
                                <i class="fas fa-square text-warning mr-2"> Canceladas</i>                            
                            </div>
                            <div class="col-4 text-right">
                                <b-button size="sm" variant="info" @click="modalRelatorio()">
                                    Relatório
                                </b-button>
                            </div>
                        </div>
                    </template>
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="totalRows" align="center" :per-page="perPage" aria-controls="tb-vendas"></b-pagination>
            </div>
        </div>
        `,
    data(){
        return {
            perPage: Math.ceil(window.screen.height / 75),
            currentPage: 1,
            campos:[
                {key: 'btn_add', class: 'text-left'},
                {key: 'btn_cancelar', class: 'text-left'},
                {key: 'id_vendedor', label: 'Id Vendedor',},
                {key: 'nome', label: 'Vendedor',},
                {key: 'email', label: 'E-mail'},
                {key: 'comissao', label: 'comissão', formatter:this.formataVr},
                {key: 'id', label: 'Id Venda',},
                {key: 'valor', label: 'Valor', formatter:this.formataVr},
                {key: 'data', label: 'Data', formatter:this.formataDataBr},
            ],
            rdSituacao: '',
            vendas: [],
            totalRows: 1,
            tituloModal: '',
            listaVendedores: [],
            vendedor: "",
            valor: '',
            vendedorPesquisa: '',
            valorPesquisa: '',
            situacaoPesquisa: '',
            dataPesquisaInicio: '',
            dataPesquisaFim: '',
            emailPara: '',
        }
    },
    async mounted(){
        await this.buscavendas();
        await this.buscavendores();
    },
    methods:{
        formataDataBr(dt){
            if(dt != null && dt != '')
            {
                return dt.split('-').reverse().join("/");
            }

            return '';
        },
        formataVr(vr){
            return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vr);
        },
        pesquisarVendas(){
            var obj = {};
            if(this.vendedorPesquisa && Number(this.vendedorPesquisa) > 0)
                obj.vendedor = this.vendedorPesquisa;
            
            var vr = this.$ci.getValue(this.$refs.txtValorPesquisa);
            if(Number(vr) > 0)
                obj.valor = vr;

            obj.situacao = this.situacaoPesquisa;

            if(this.dataPesquisaInicio || this.dataPesquisaFim){
                if(!this.dataPesquisaInicio || !this.dataPesquisaFim){
                    toastr.warning("Informe datas de início e fim","", {timeOut: 2000, positionClass: "toast-top-center"});
                    return;
                }
                else{
                    obj.datainicio = this.dataPesquisaInicio;
                    obj.datafim = this.dataPesquisaFim;
                }
            }
            this.$bvModal.hide('ModalPesquisaVendas');
            this.buscavendas(obj);
        },
        async buscavendas(pesquisa = {}){
            this.vendas = [];
            await axios.get('http://localhost/programador_1/php/api/buscavendas.php', {params:pesquisa})
            .then(response => {
                if(response.data.retorno == "OK")
                    this.vendas = response.data.dados;
                else
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        async buscavendores(){
            this.listaVendedores = [];
            await axios.get('http://localhost/programador_1/php/api/buscavendedores.php')
            .then(response => {
                
                if(response.data.retorno == "OK"){
                    this.listaVendedores = response.data.dados.map(function(vd) {
                        return {
                            value : vd.id,
                            text : vd.nome,
                        };
                    });
                    this.listaVendedores.push({value: '', text:'Todos'});
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        PerquisarVendas(){
            this.$bvModal.show('ModalPesquisaVendas');
        },
        cancelarVendas(data){
            if(Number(data.cancelada) == 1){
                toastr.warning("Venda já foi cancelada","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            Swal.fire({
                title: 'Cancelar venda?',
                text: "Deseja cancelar a Venda?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    axios.put('http://localhost/programador_1/php/api/cancelarVendas.php', {id:data.id})
                    .then(response => {
                        if(response.data.retorno == "OK"){
                            toastr.success("Venda cancelada com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                            this.buscavendas();
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
            this.vendedor = "";
            this.valor = '';
        },
        incluirVendas(){
            this.limpaCampos();
            this.tituloModal = "Incluir Vendas";
            this.$bvModal.show('modalVendas');
        },
        inclusaoVendas(){
            if(!this.vendedor || Number(this.vendedor) == 0){
                toastr.warning("Selecione um vendedor","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            var vr = this.$ci.getValue(this.$refs.txtValor);
            if(Number(vr) <= 0){
                toastr.warning("Informe um valor válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            Swal.fire({
                title: "Incluir",
                text: "Deseja incluir nova Venda?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this.confirmaIncluirVendas(vr);
                }
            })
        },
        confirmaIncluirVendas(vr){
            axios.post('http://localhost/programador_1/php/api/incluirvendas.php', {vendedor:this.vendedor, valor: vr})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Venda incluída com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalVendas');
                    this.buscavendas();
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });
        },
        modalRelatorio(){
            this.$bvModal.show('modalRelatorioVendas');
        },
        validarEmail(email) 
        {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
                return true;

            return false;
        },
        enviarRelatorio(){
            if(!this.emailPara || !this.validarEmail(this.emailPara)){
                toastr.warning("Informe um email válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            Swal.fire({
                title: "Relatório",
                text: "Deseja enviar o relatório",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this.confirmaEnvioRelatorio();
                }
            })
        },
        confirmaEnvioRelatorio(){
            axios.get('http://localhost/programador_1/php/api/gerarrelatorio.php', {params:{email:this.emailPara}})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Relatório enviado com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalRelatorioVendas');
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
            this.$bvModal.hide('modalVendas');
        },
        watch:{
            vendas(){
                this.vendas = this.vendedores.length == 0 ? 1 : this.vendedores.length;
            }
        }
    }
});