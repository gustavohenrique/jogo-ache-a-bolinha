(function () {

    describe('Jogo Ache a Bolinha', function () {
        it('deve exibir 3 copos, 1 bolinha dentro do copo do meio e 1 botao start na tela inicial', function () {
            jogo.desenhar();
            $(copo.A.seletor).should.be.visible;
            $(copo.B.seletor).should.be.visible;
            $(copo.C.seletor).should.be.visible;
            $(bolinha.seletor).should.be.visible;
            $(copo.B.seletor).should.have(bolinha.seletor);
            $(start.seletor).should.be.visible;
        });

        it('define posicao inicial dos componentes', function () {
            expect(copo.A.posicao.left).to.equal(0);
            expect(copo.B.posicao.left).to.equal(275);
            expect(copo.C.posicao.left).to.equal(545);
            expect(bolinha.posicao.left).to.equal(30);
        });

        it('posiciona a bolinha dentro do copo do meio', function () {
            jogo.posicionarBolinhaDentroDoCopo();
            expect(bolinha.posicao.top).to.equal(80);
        });

        it('obtem os 2 copos que serao movidos na jogada', function () {
            Math.round = sinon.stub();
            Math.round.onCall(0).returns(0);
            Math.round.onCall(1).returns(2);

            var copos = copo.obterCoposQueSeraoMovidos();
            expect(copos[0].seletor).to.equal(copo.A.seletor);
            expect(copos[1].seletor).to.equal(copo.C.seletor);
        });

        it('troca a posicao do primeiro copo com o segundo e vice-versa', function () {
            jogo.copos = [copo.A, copo.B, copo.C];
            jogo.trocarPosicao(copo.A, copo.C);
            expect(copo.A.posicao.left).to.equal(copo.C.posicao.leftInicial);
            expect(copo.C.posicao.left).to.equal(copo.A.posicao.leftInicial);
            expect(jogo.copos[0].seletor).to.equal(copo.C.seletor);
            expect(jogo.copos[1].seletor).to.equal(copo.B.seletor);
            expect(jogo.copos[2].seletor).to.equal(copo.A.seletor);

            //jogo.copos = [copo.C, copo.B, copo.A];
            jogo.trocarPosicao(copo.B, copo.A);
            expect(copo.B.posicao.left).to.equal(copo.C.posicao.leftInicial);
            expect(copo.A.posicao.left).to.equal(copo.B.posicao.leftInicial);
            expect(jogo.copos[0].seletor).to.equal(copo.C.seletor);
            expect(jogo.copos[1].seletor).to.equal(copo.A.seletor);
            expect(jogo.copos[2].seletor).to.equal(copo.B.seletor);

            //jogo.copos = [copo.C, copo.A, copo.B];
            jogo.trocarPosicao(copo.A, copo.C);
            expect(copo.A.posicao.left).to.equal(copo.A.posicao.leftInicial);
            expect(copo.C.posicao.left).to.equal(copo.B.posicao.leftInicial);
            expect(jogo.copos[0].seletor).to.equal(copo.A.seletor);
            expect(jogo.copos[1].seletor).to.equal(copo.C.seletor);
            expect(jogo.copos[2].seletor).to.equal(copo.B.seletor);      

        });

        it('quando selecionar um copo deve incrementar total de vitorias se venceu', function () {
            jogo.copoSelecionado = copo.A;
            jogo.confirmarCopoSelecionado();
            expect(jogo.vitorias).to.equal(0);

            jogo.copoSelecionado = copo.B;
            jogo.confirmarCopoSelecionado();
            expect(jogo.vitorias).to.equal(1);

            jogo.confirmarCopoSelecionado();
            expect(jogo.vitorias).to.equal(2);
        });

        it('posiciona a bolinha fora do copo', function () {
            jogo.posicionarBolinhaForaDoCopo();
            expect(bolinha.posicao.top).to.equal(bolinha.posicao.topInicial);
        });

        it('exibe resultado quando venceu', function () {
            jogo.vitorias = 1;
            jogo.exibirResultado();
            $(resultado.seletor).should.have.html(resultado.venceu.texto);
            $(resultado.seletor).should.have.class(resultado.venceu.cls);
        });

        it('exibe resultado quando perdeu ou nao ha vitorias', function () {
            jogo.vitorias = 0;
            jogo.exibirResultado();
            $(resultado.seletor).should.have.html(resultado.perdeu.texto);
            $(resultado.seletor).should.have.class(resultado.perdeu.cls);
        });

        it('reseta o jogo para comecar novamente', function () {
            jogo.vitorias = 1;
            jogo.numeroJogadas = 2;
            jogo.reset();
            expect(jogo.vitorias).to.equal(0);
            expect(jogo.numeroJogadas).to.equal(0);
        });

    });
})();

