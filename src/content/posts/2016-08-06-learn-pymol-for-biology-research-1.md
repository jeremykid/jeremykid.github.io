---
title: "Learn-PyMOL-for-Biology-Research-1"
date: 2016-08-06T16:37:41.000Z
slug: "Learn-PyMOL-for-Biology-Research-1"
summary: "Updated in Aug/22/2016 ====== Here I will teach How to set the environment in Mac 1. (install the Xcode and Xcode command tool.)[http://railsapps.github.io/xcode command line tools.html] 2...."
tags:
  - "Research"
legacyPath: "/2016/08/06/Learn-PyMOL-for-Biology-Research-1/"
legacyTopLevelPaths: []
legacyTagSlugs: []
---
Updated in Aug/22/2016
======
Here I will teach How to set the environment in Mac
1. (install the Xcode and Xcode-command-tool.)[http://railsapps.github.io/xcode-command-line-tools.html]

2. (install the MacPort)[https://www.macports.org/install.php]
  update MacPort by this command
  ```
  sudo port -v selfupdate
  ```

3. Tried to install PyMOL by MacPort
  ```
  sudo port install pymol
  ```
  And following the tips in the warning to install the python

  ```
  find ~/ -type f -name "_cmd.so"
  ```
  eg: return 
  ```
  /opt//local/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages/pymol/_cmd.so
  ```
  Try to add the path of folder of pymol in the PYTHONPATH
  eg: /opt//local/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages/
  ```
  PYTHONPATH="/opt//local/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages"
  export PYTHONPATH
  ```

Abstract:
======
This Series of blog pages is about the Script of PyMOL. If you are an expert of PyMOL/Python and give me some suggestions or find some errors in this page, I will be very happpppy. This is my First time to use PyMOL

Since the Dr.Marcelo Marcet-Palacios only provide a exist file of PyMOL software without a PyMOL API for Python. I am starting to setup the environment of Open-Source PyMOL, which take a long time(take care).

Setup Environment.
======
Dr.Marcelo Marcet-Palacios helped me to install the PyMOL by a Mac-package. However, I found the python script cannot load the PyMOL module. I started to find the reason. 

[https://www.biostars.org/p/113328/](https://www.biostars.org/p/113328/) helps a lot. If you want to 
```python
import pymol
```
in your script, you wish you can install the pymol following the steps of installing an Open-Source PyMOL.

So I started to follow the http://www.pymolwiki.org/index.php/MAC_Install to install an Open-Source PyMOL. If your mac is over 10.5, my feedback is not use the fink, which is not easy to install.

Try this
```
sudo port install tcl -corefoundation
sudo port install tk -quartz

sudo port install pymol
```

The other issue make me so annoying is that
```
Traceback (most recent call last):
  File "/usr/local/Cellar/pymol/1.8.2.1/libexec/lib/python2.7/site-packages/pymol/__init__.py", line 72, in <module>
    import pymol
  File "/usr/local/Cellar/pymol/1.8.2.1/libexec/lib/python2.7/site-packages/pymol/__init__.py", line 536, in <module>
    import pymol._cmd
ImportError: dlopen(/usr/local/Cellar/pymol/1.8.2.1/libexec/lib/python2.7/site-packages/pymol/_cmd.so, 2): Library not loaded: /usr/local/opt/glew/lib/libGLEW.2.0.0.dylib
  Referenced from: /usr/local/Cellar/pymol/1.8.2.1/libexec/lib/python2.7/site-packages/pymol/_cmd.so
  Reason: image not found
```

I in my 
```
/usr/local/opt/glew/lib
```

It only has these following files:
```
libGLEW.1.13.0.dylib  libGLEW.dylib    libGLEWmx.a
libGLEW.1.13.dylib  libGLEWmx.1.13.0.dylib  libGLEWmx.dylib
libGLEW.a    libGLEWmx.1.13.dylib  pkgconfig
```
The brew cannot upgrade the openGL. I have to update the XOs to the newest version. So I am downloading the package for 6 GB.

See you tomorrow. Hopefully, I could setup the environment.

Reference
======
https://www.biostars.org/p/113328/
http://www.pymolwiki.org/index.php/MAC_Install
