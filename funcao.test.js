const {
    soma,
    ehPar,
    paraMaiusculas,
    filtrarMaioresQue,
    obterUsuario,
    obterTemperatura,
    contarOcorrencias
} = require('./funcoes');

describe('Testes da função soma', () => {
    test('deve somar dois números positivos', () => {
        expect(soma(2, 3)).toBe(5);
    });

    test('deve somar números negativos', () => {
        expect(soma(-5, -3)).toBe(-8);
    });

    test('deve somar número positivo com negativo', () => {
        expect(soma(10, -3)).toBe(7);
    });

    test('deve somar com zero', () => {
        expect(soma(5, 0)).toBe(5);
    });

    test('deve somar números decimais', () => {
        expect(soma(1.5, 2.3)).toBeCloseTo(3.8);
    });

    test('deve somar números muito grandes', () => {
        expect(soma(999999999, 1)).toBe(1000000000);
    });
});

describe('Testes da função ehPar', () => {
    test('deve retornar true para número par positivo', () => {
        expect(ehPar(4)).toBe(true);
    });

    test('deve retornar false para número ímpar positivo', () => {
        expect(ehPar(7)).toBe(false);
    });

    test('deve retornar true para zero', () => {
        expect(ehPar(0)).toBe(true);
    });

    test('deve retornar true para número par negativo', () => {
        expect(ehPar(-6)).toBe(true);
    });

    test('deve retornar false para número ímpar negativo', () => {
        expect(ehPar(-3)).toBe(false);
    });

    test('deve funcionar com números grandes', () => {
        expect(ehPar(1000000)).toBe(true);
    });
});

describe('Testes da função paraMaiusculas', () => {
    test('deve converter texto minúsculo para maiúsculo', () => {
        expect(paraMaiusculas('hello')).toBe('HELLO');
    });

    test('deve manter texto já em maiúsculas', () => {
        expect(paraMaiusculas('WORLD')).toBe('WORLD');
    });

    test('deve converter texto misto', () => {
        expect(paraMaiusculas('HeLLo WoRLd')).toBe('HELLO WORLD');
    });

    test('deve lidar com string vazia', () => {
        expect(paraMaiusculas('')).toBe('');
    });

    test('deve converter texto com acentos', () => {
        expect(paraMaiusculas('olá mundo')).toBe('OLÁ MUNDO');
    });

    test('deve preservar números e caracteres especiais', () => {
        expect(paraMaiusculas('abc123!@#')).toBe('ABC123!@#');
    });
});

describe('Testes da função filtrarMaioresQue', () => {
    test('deve filtrar números maiores que o limite', () => {
        expect(filtrarMaioresQue([1, 5, 10, 15, 20], 10)).toEqual([15, 20]);
    });

    test('deve retornar array vazio quando nenhum número é maior', () => {
        expect(filtrarMaioresQue([1, 2, 3], 10)).toEqual([]);
    });

    test('deve retornar todos os números quando todos são maiores', () => {
        expect(filtrarMaioresQue([15, 20, 25], 10)).toEqual([15, 20, 25]);
    });

    test('deve lidar com array vazio', () => {
        expect(filtrarMaioresQue([], 5)).toEqual([]);
    });

    test('deve filtrar com números negativos', () => {
        expect(filtrarMaioresQue([-5, -2, 0, 3, 5], 0)).toEqual([3, 5]);
    });

    test('deve filtrar com números decimais', () => {
        expect(filtrarMaioresQue([1.5, 2.7, 3.2, 4.8], 3)).toEqual([3.2, 4.8]);
    });

    test('não deve incluir números iguais ao limite', () => {
        expect(filtrarMaioresQue([5, 10, 15], 10)).toEqual([15]);
    });
});

describe('Testes da função obterUsuario', () => {
    const mockDB = [
        { id: 1, nome: 'João', email: 'joao@email.com' },
        { id: 2, nome: 'Maria', email: 'maria@email.com' },
        { id: 3, nome: 'Pedro', email: 'pedro@email.com' }
    ];

    test('deve retornar usuário quando ID existe', () => {
        expect(obterUsuario(2, mockDB)).toEqual({
            id: 2,
            nome: 'Maria',
            email: 'maria@email.com'
        });
    });

    test('deve retornar null quando ID não existe', () => {
        expect(obterUsuario(999, mockDB)).toBeNull();
    });

    test('deve retornar primeiro usuário', () => {
        expect(obterUsuario(1, mockDB)).toEqual({
            id: 1,
            nome: 'João',
            email: 'joao@email.com'
        });
    });

    test('deve retornar null para database vazia', () => {
        expect(obterUsuario(1, [])).toBeNull();
    });

    test('deve lidar com ID zero', () => {
        const dbComZero = [{ id: 0, nome: 'Admin' }];
        expect(obterUsuario(0, dbComZero)).toEqual({ id: 0, nome: 'Admin' });
    });
});

describe('Testes da função obterTemperatura', () => {
    test('deve retornar temperatura para cidade válida', async () => {
        const mockAPI = {
            getTemperatura: jest.fn().mockResolvedValue(25)
        };

        const resultado = await obterTemperatura('São Paulo', mockAPI);
        
        expect(resultado).toBe(25);
        expect(mockAPI.getTemperatura).toHaveBeenCalledWith('São Paulo');
        expect(mockAPI.getTemperatura).toHaveBeenCalledTimes(1);
    });

    test('deve retornar temperatura negativa', async () => {
        const mockAPI = {
            getTemperatura: jest.fn().mockResolvedValue(-10)
        };

        const resultado = await obterTemperatura('Moscou', mockAPI);
        expect(resultado).toBe(-10);
    });

    test('deve lidar com erro da API', async () => {
        const mockAPI = {
            getTemperatura: jest.fn().mockRejectedValue(new Error('API indisponível'))
        };

        await expect(obterTemperatura('Londres', mockAPI))
            .rejects
            .toThrow('API indisponível');
    });

    test('deve retornar temperatura decimal', async () => {
        const mockAPI = {
            getTemperatura: jest.fn().mockResolvedValue(23.5)
        };

        const resultado = await obterTemperatura('Rio de Janeiro', mockAPI);
        expect(resultado).toBe(23.5);
    });
});

describe('Testes da função contarOcorrencias', () => {
    test('deve contar ocorrências de palavra única', () => {
        expect(contarOcorrencias('o gato subiu no telhado', 'gato')).toBe(1);
    });

    test('deve contar múltiplas ocorrências', () => {
        expect(contarOcorrencias('o rato roeu a roupa do rei de roma', 'ro')).toBe(2);
    });

    test('deve ser case insensitive', () => {
        expect(contarOcorrencias('JavaScript é legal. javascript é poderoso', 'javascript')).toBe(2);
    });

    test('deve retornar zero quando palavra não existe', () => {
        expect(contarOcorrencias('teste de texto', 'palavra')).toBe(0);
    });

    test('deve contar palavra no início do texto', () => {
        expect(contarOcorrencias('teste é um teste', 'teste')).toBe(2);
    });

    test('deve contar palavra no final do texto', () => {
        expect(contarOcorrencias('este é um teste', 'teste')).toBe(1);
    });

    test('deve lidar com string vazia', () => {
        expect(contarOcorrencias('', 'palavra')).toBe(0);
    });

    test('deve considerar limites de palavra (word boundary)', () => {
        expect(contarOcorrencias('teste testando testador', 'teste')).toBe(1);
    });

    test('deve contar palavras com pontuação', () => {
        expect(contarOcorrencias('Olá, mundo! mundo é bonito. Mundo!', 'mundo')).toBe(3);
    });

    test('deve contar ocorrências em texto longo', () => {
        const texto = 'teste '.repeat(10);
        expect(contarOcorrencias(texto, 'teste')).toBe(10);
    });
    });