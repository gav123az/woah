<template>
    <div>
        <div class="hero-section">
            <div class="hero-container">
                <div class="hero-left">
                    <p class="japanese-label">ラーメン</p>
                    <div class="wavy-line"></div>
                    <h1 class="hero-title">A BOWL OF LOVE FROM<br /><span class="highlight">JAPANESE CUISINE</span><br />FOR YOU</h1>
                    <router-link to="/products" class="btn-order">Order Now</router-link>
                    <p class="hero-subtitle">Ramen is a traditional Japanese noodle soup. It consists of Chinese wheat noodles served in a meat or fish-based broth & uses toppings such as sliced pork, nori, menma, and scallions.</p>
                </div>
                <div class="hero-right">
                    <div class="hero-image-container">
                      <img src="https://static.vecteezy.com/system/resources/thumbnails/027/291/207/small_2x/cartoon-ramen-no-background-free-png.png" alt="Ramen" class="hero-image" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hero-section {
  width: 100vw;
  background: var(--primary-bg);
  padding: 0;
  margin: 0;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: stretch;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  align-items: center;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 60px 50px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 20px 40px 0;
}

.japanese-label {
  color: var(--primary-color);
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.wavy-line {
  width: 40px;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    var(--text-dark) 0px,
    var(--text-dark) 5px,
    transparent 5px,
    transparent 10px
  );
  margin: 10px 0 30px 0;
}

.hero-title {
  font-size: 48px;
  font-weight: 900;
  line-height: 1.3;
  color: var(--text-dark);
  margin: 0 0 20px 0;
}

.hero-title .highlight {
  color: var(--primary-color);
}

.hero-subtitle {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin: 0 0 30px 0;
  max-width: 90%;
}

.btn-order {
  background: var(--primary-color);
  color: white;
  padding: 10px 28px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  display: inline-block;
  transition: all 0.3s ease;
  margin: 20px 0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(214, 69, 69, 0.3);
}

.btn-order:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(214, 69, 69, 0.4);
}

.social-links {
  display: flex;
  gap: 30px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid var(--primary-color);
}

.social-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--primary-dark);
}

.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.hero-image-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

@media (max-width: 991px) {
  .hero-container {
    grid-template-columns: 1fr;
    padding: 40px 30px;
  }

  .hero-left {
    padding: 0;
    order: 2;
  }

  .hero-right {
    order: 1;
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-image {
    max-height: 350px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 13px;
    max-width: 100%;
  }

  .japanese-label {
    font-size: 20px;
  }

  .social-links {
    flex-direction: column;
    gap: 15px;
  }

  .hero-image {
    max-height: 250px;
  }
}
</style>