# The Standard Streams: `stdin`, `stdout`, and `stderr`
author: jfarmer

levels:

  - basic

  - medium

type: normal

category: must-know

tags: []

inAlgoPool: false

links: []

---
## Content

In Unix, when a program wants to open a file for reading or writing it must obtain a "file descriptor" from the operating system.  The operating system keeps track of which file descriptor references which file.

Every process is automatically assigned three default file descriptors called `stdin` (standard input), `stdout` (standard output), and `stderr` (standard stream).  Collectively these three file descriptors are sometimes called the "standard streams."

Historically, "standard input" meant a physical keyboard and the two output streams meant a monitor, but Unix abstracted this.  Thus a program reading from standard input doesn't know whether the input is coming from a human behind a keyboard, another program, the network, or some other source.  Likewise, a program writing to standard output doesn't know whether its output is being displayed on a monitor, sent to another program, or written to a file.

These abstractions form the basis for Unix pipelines, where the standard output of one program is fed to the standard input of another program.  Together, the result is behavior that neither program could produce on its own.
