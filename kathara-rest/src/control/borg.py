import threading


class MetaBorg(type):
    _state = {"__skip_init__": False}
    _borg_lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        if cls._state['__skip_init__']:
            cls.__check_args(*args, **kwargs)
        with cls._borg_lock:
            instance = object().__new__(cls, *args, **kwargs)
        instance.__dict__ = cls._state
        if not cls._state['__skip_init__']:
            instance.__init__(*args, **kwargs)
            cls._state['__skip_init__'] = True
        return instance

    def __check_args(cls, *args, **kwargs):
        nargs = len(args)
        if nargs > 0:
            raise TypeError(
                '{}() takes 0 positional arguments after first initialization but {} was given'.format(
                    cls.__name__, nargs
                )
            )
        nkeys = len(kwargs)
        if nkeys > 0:
            raise TypeError(
                "{}() got an unexpected keyword argument '{}' after first initialization".format(
                    cls.__name__, list(kwargs.keys())[0]
                )
            )
