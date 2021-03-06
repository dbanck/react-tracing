const Tracing = require("../");

class MockTracer {
  constructor(finish) {
    this.finish = finish;
  }

  startSpan(spanName) {
    return { name: spanName, finish: this.finish, log: jest.fn() };
  }
}

describe("react-tracing", () => {
  describe("opentracing forwarding", () => {
    let tracer, finishMock;

    beforeEach(() => {
      finishMock = jest.fn();
      tracer = new Tracing({ tracer: new MockTracer(finishMock) });
    });

    it("should be able to start a span", () => {
      tracer.startSpan("foo");

      expect(tracer.stack.peek().name).toBe("foo");
    });

    it("should be able to log a span", () => {
      tracer.startSpan("bar");
      tracer.log({ foo: 3 });

      expect(tracer.stack.peek().log).toHaveBeenCalledWith({ foo: 3 });
    });

    it("should be able to finish", () => {
      tracer.startSpan("baz");
      tracer.finishSpan();

      expect(finishMock).toHaveBeenCalled();
      expect(tracer.stack.list.length).toBe(0);
    });
  });
});
