/**
 * SerialManager
 * Web Serial API を利用した機器との非同期通信を管理するクラス
 */
export class SerialManager {
  /** @type {SerialPort | null} */
  #port = null;

  /** @type {ReadableStreamDefaultReader<Uint8Array> | null} */
  #reader = null;

  /** @type {WritableStreamDefaultWriter<Uint8Array> | null} */
  #writer = null;

  /**
   * シリアルポートに接続し、リーダー・ライターを初期化する
   * @returns {Promise<void>}
   */
  async connect () {
    this.#port = await navigator.serial.requestPort();
    await this.#port.open({ baudRate: 9600 });

    this.#reader = this.#port.readable.getReader();
    this.#writer = this.#port.writable.getWriter();
  }

  /**
   * シリアル接続を解除し、リソースを解放する
   * @returns {Promise<void>}
   */
  async disconnect () {
    if (this.#reader) {
      await this.#reader.cancel();
      this.#reader.releaseLock();
      this.#reader = null;
    }

    if (this.#writer) {
      this.#writer.releaseLock();
      this.#writer = null;
    }

    if (this.#port) {
      await this.#port.close();
      this.#port = null;
    }
  }

  /**
   * 1行の応答を読み取る（終端文字が来るまで or タイムアウト）
   * @param {number} timeout - タイムアウト時間 (ms)
   * @returns {Promise<string>}
   */
  async #readLine (timeout = 1000) {
    if (!this.#reader) throw new Error('Serial port not connected');

    const decoder = new TextDecoder();
    let result = '';

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout)
    });

    const readPromise = (async () => {
      while (true) {
        const {done, value} = await this.#reader.read();
        if (done) break;
        result += decoder.decode(value);
        if (result.includes('\n') || result.includes('\r')) break;
      }
      return result.trim();
    })();

    return Promise.race([readPromise, timeoutPromise]);
  }

  /**
   * コマンドを送信し、応答を1行で取得する
   * @param {string} command - 送信コマンド（終端文字なし）
   * @param {number} timeout - タイムアウト時間 (ms)
   * @returns {Promise<string>}
   */
  async queryCommand (command, timeout = 1000) {
    await this.sendCommand(command);
    return await this.#readLine(timeout);
  }

  /**
   * コマンドを送信（改行を自動付加）
   * @param {string} command - 送信コマンド
   * @returns {Promise<void>}
   */
  async sendCommand (command) {
    if (!this.#writer) throw new Error('Serial port not connected');

    const encoder = new TextEncoder();
    await this.#writer.write(encoder.encode(`${command}\n`));
  }
}
