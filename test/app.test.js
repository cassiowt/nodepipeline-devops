const request = require('supertest');
const app = require('../server');

describe('API', () => {
    test('GET / responde healthy', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true, data: 'healthy!' });
    });

    test('GET /teste responde com sucesso', async () => {
        const res = await request(app).get('/teste');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('rota inexistente responde 404', async () => {
        const res = await request(app).get('/nao-existe');
        expect(res.statusCode).toBe(404);
    });
});

describe('Páginas', () => {
    test('GET /index mostra o hostname', async () => {
        const res = await request(app).get('/index');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain(require('os').hostname());
    });

    test('GET /about responde com sucesso', async () => {
        const res = await request(app).get('/about');
        expect(res.statusCode).toBe(200);
    });
});

describe('Métricas', () => {
    test('GET /metrics expõe o contador de requisições', async () => {
        await request(app).get('/');
        const res = await request(app).get('/metrics');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('http_requests_total');
    });
});
